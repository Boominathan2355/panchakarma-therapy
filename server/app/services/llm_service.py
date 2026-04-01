import json
import logging
from huggingface_hub import InferenceClient
from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a medical document parser specializing in Ayurvedic Panchakarma therapy protocols.
Extract the following structured information from the provided text and return ONLY valid JSON (no markdown, no explanation):

{
  "therapyName": "one of: Vamana, Virechana, Basti, Nasya, Raktamokshana",
  "description": "brief description of the therapy",
  "workflow": [
    {
      "step": 1,
      "action": "name of the procedure step",
      "duration": "duration as string (e.g., '30 minutes', '1 day')",
      "notes": "additional notes for this step",
      "requiredMaterials": [
        {"name": "material name", "quantity": "amount", "unit": "unit of measurement"}
      ],
      "precautions": ["precaution 1", "precaution 2"]
    }
  ],
  "contraindications": ["condition 1", "condition 2"],
  "safetyNotes": "general safety information"
}

If you cannot determine a therapy type, use your best judgment based on the content.
Always return valid JSON. Do not include any text outside the JSON object."""


async def process_therapy_document(raw_text: str) -> dict:
    """Send extracted text to HuggingFace Inference API for structured JSON generation."""
    if not settings.HF_API_TOKEN:
        logger.warning("HF_API_TOKEN not set, returning mock structured data")
        return _generate_fallback(raw_text)

    client = InferenceClient(token=settings.HF_API_TOKEN)

    for attempt in range(3):
        try:
            response = client.text_generation(
                prompt=f"[INST] {SYSTEM_PROMPT}\n\nTherapy Document Text:\n{raw_text[:4000]} [/INST]",
                model=settings.HF_MODEL_ID,
                max_new_tokens=2000,
                temperature=0.1,
            )

            # Extract JSON from response
            json_str = response.strip()
            # Handle cases where model wraps JSON in markdown
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0]
            elif "```" in json_str:
                json_str = json_str.split("```")[1].split("```")[0]

            structured = json.loads(json_str)
            return _validate_and_normalize(structured)

        except json.JSONDecodeError as e:
            logger.warning(f"LLM JSON parse failed (attempt {attempt + 1}): {e}")
            continue
        except Exception as e:
            logger.error(f"LLM API error (attempt {attempt + 1}): {e}")
            continue

    logger.error("All LLM attempts failed, returning fallback")
    return _generate_fallback(raw_text)


def _validate_and_normalize(data: dict) -> dict:
    """Validate and normalize the LLM output to match expected schema."""
    valid_types = ["Vamana", "Virechana", "Basti", "Nasya", "Raktamokshana"]
    therapy_name = data.get("therapyName", "Vamana")
    if therapy_name not in valid_types:
        therapy_name = "Vamana"

    workflow = []
    for i, step in enumerate(data.get("workflow", []), 1):
        materials = []
        for m in step.get("requiredMaterials", []):
            materials.append({
                "name": m.get("name", "Unknown"),
                "quantity": str(m.get("quantity", "1")),
                "unit": m.get("unit", "unit"),
            })
        workflow.append({
            "id": f"step-{i}",
            "step": i,
            "action": step.get("action", f"Step {i}"),
            "duration": step.get("duration", "30 minutes"),
            "notes": step.get("notes", ""),
            "requiredMaterials": materials,
            "precautions": step.get("precautions", []),
        })

    return {
        "therapyName": therapy_name,
        "description": data.get("description", ""),
        "workflow": workflow,
        "contraindications": data.get("contraindications", []),
        "safetyNotes": data.get("safetyNotes", ""),
    }


def _generate_fallback(raw_text: str) -> dict:
    """Generate a basic structured representation when LLM is unavailable."""
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    therapy_name = "Vamana"

    for t in ["Vamana", "Virechana", "Basti", "Nasya", "Raktamokshana"]:
        if t.lower() in raw_text.lower():
            therapy_name = t
            break

    return {
        "therapyName": therapy_name,
        "description": lines[0] if lines else "Extracted therapy protocol",
        "workflow": [
            {
                "id": "step-1",
                "step": 1,
                "action": "Review extracted document",
                "duration": "Varies",
                "notes": "Auto-extracted. Please review and edit manually.",
                "requiredMaterials": [],
                "precautions": ["Review by physician required"],
            }
        ],
        "contraindications": [],
        "safetyNotes": "This protocol was auto-extracted. Please verify all details.",
    }
