"""
Seed script for PTAS MongoDB database.
Run with: python seed_data.py [--force]
"""
import asyncio
import sys
from datetime import datetime, timedelta, timezone

# Fix imports
sys.path.insert(0, ".")

from app.config import settings
from app.database import init_db, close_db
from app.models.user import User
from app.models.patient import Patient, PatientHistoryEntry, PatientAvailability
from app.models.therapy import TherapyDefinition, TherapyWorkflowStep, RequiredMaterial, TherapyDocument
from app.models.therapy_plan import TherapyPlanDefinition, TherapySequenceItem
from app.models.resource import Therapist, Room, Material
from app.models.audit import AuditLog
from app.models.schedule import ScheduleEntry
from app.services.auth_service import hash_password


# ── Patient generation (matching frontend patientService.ts) ──

FIRST_NAMES = [
    "Ramesh", "Sita", "Arjun", "Priya", "Vikram", "Ananya", "Ravi", "Meera",
    "Suresh", "Kavita", "Deepak", "Lakshmi", "Arun", "Pooja", "Kartik", "Radha",
    "Mohan", "Divya", "Harsh", "Nandini", "Sandeep", "Aarti", "Rajesh", "Swati",
    "Manoj", "Geeta", "Ashok", "Neha", "Prakash", "Sunita", "Gaurav", "Bhavna",
    "Rohit", "Kiran", "Vivek", "Anjali", "Sanjay", "Rekha", "Amit", "Padma",
    "Nikhil", "Seema", "Tarun", "Usha", "Ajay", "Malini", "Dinesh", "Shobha",
    "Vinod", "Pushpa",
]

LAST_NAMES = [
    "Gupta", "Verma", "Das", "Sharma", "Patel", "Iyer", "Nair", "Reddy",
    "Mehta", "Singh", "Kumar", "Joshi", "Rao", "Bhat", "Pillai", "Mishra",
    "Chauhan", "Agarwal", "Tiwari", "Saxena", "Dubey", "Pandey", "Kulkarni",
    "Desai", "Mukherjee",
]

COMPLAINTS = [
    "Severe Back Pain", "Migraine", "Arthritis", "Chronic Fatigue", "Skin Disorder",
    "Respiratory Issues", "Digestive Problems", "Joint Stiffness", "Anxiety & Stress",
    "Insomnia", "Sciatica", "Cervical Spondylosis", "Obesity", "Allergic Rhinitis",
    "Frozen Shoulder", "Psoriasis", "Sinus Congestion", "Lower Back Pain",
    "Knee Pain", "Muscle Weakness",
]

ALL_CONDITIONS = [
    "Hypertension", "Spondylosis", "Anemia", "Diabetes", "Cardiac conditions",
    "Asthma", "Thyroid", "PCOD", "Obesity", "Anxiety", "Depression",
    "Gastritis", "Liver disorder", "Kidney stones", "Varicose veins",
]

HISTORY_TYPES = ["Consultation", "Treatment", "Follow-up", "Lab Test", "Therapy Session"]


def generate_patient(index: int) -> Patient:
    first = FIRST_NAMES[index % len(FIRST_NAMES)]
    last = LAST_NAMES[index % len(LAST_NAMES)]
    name = f"{first} {last}"
    age = 20 + (index % 55)
    gender = "Female" if index % 3 == 0 else "Male"

    condition_count = (index % 3) + 1
    conditions = []
    for c in range(condition_count):
        conditions.append(ALL_CONDITIONS[(index + c * 7) % len(ALL_CONDITIONS)])

    history_count = (index % 4) + 1
    history = []
    base_date = datetime(2025, 1, 1, tzinfo=timezone.utc)
    for h in range(history_count):
        d = base_date - timedelta(days=(h + 1) * 15 + index)
        history.append(PatientHistoryEntry(
            date=d.strftime("%Y-%m-%d"),
            type=HISTORY_TYPES[(index + h) % len(HISTORY_TYPES)],
            notes=f"Patient reported improvement in session {h + 1}",
        ))

    avail_start = datetime(2025, 3, 1, 9, 0, tzinfo=timezone.utc) + timedelta(days=index % 14)
    availability = [
        PatientAvailability(
            start=avail_start.isoformat(),
            end=(avail_start + timedelta(hours=4)).isoformat(),
        )
    ]

    return Patient(
        pid=f"p{index + 1}",
        name=name,
        age=age,
        gender=gender,
        email=f"{first.lower()}.{last.lower()}@example.com",
        phone=f"+91 {9800000000 + index}",
        complaint=COMPLAINTS[index % len(COMPLAINTS)],
        conditions=conditions,
        history=history,
        availability=availability,
    )


# ── Therapy definitions (matching frontend therapyService.ts) ──

def get_therapies():
    return [
        TherapyDefinition(
            tid="t1",
            name="Vamana",
            description="Therapeutic emesis used to expel excess Kapha from the body. Used for respiratory conditions, skin disorders, and metabolic imbalances.",
            workflow=[
                TherapyWorkflowStep(id="v1", step=1, action="Snehapana (Internal Oleation)", duration="3-7 Days", notes="Daily consumption of medicated ghee in increasing doses", requiredMaterials=[RequiredMaterial(name="Medicated Ghee", quantity="500", unit="ml")], precautions=["Monitor digestion capacity", "Stop if nausea persists"]),
                TherapyWorkflowStep(id="v2", step=2, action="Abhyanga & Swedana", duration="1-2 Days", notes="Full body oil massage followed by steam therapy", requiredMaterials=[RequiredMaterial(name="Sesame Oil", quantity="200", unit="ml"), RequiredMaterial(name="Steam Towels", quantity="4", unit="pcs")], precautions=["Check for oil allergies"]),
                TherapyWorkflowStep(id="v3", step=3, action="Vamana Karma (Emesis)", duration="1 Day", notes="Administration of emetic medicine under supervision", requiredMaterials=[RequiredMaterial(name="Madanaphala Powder", quantity="50", unit="g"), RequiredMaterial(name="Yashtimadhu Decoction", quantity="500", unit="ml")], precautions=["Keep emergency equipment ready", "Monitor patient vitals"]),
                TherapyWorkflowStep(id="v4", step=4, action="Samsarjana Krama", duration="3-7 Days", notes="Graduated diet protocol post-procedure", requiredMaterials=[], precautions=["Strict diet compliance required"]),
            ],
            contraindications=["Pregnancy", "Cardiac conditions", "Children under 12", "Elderly above 70", "Severe debility"],
            safetyNotes="Vamana must be performed under strict medical supervision. Monitor vitals throughout the procedure.",
            documents=[],
        ),
        TherapyDefinition(
            tid="t2",
            name="Virechana",
            description="Therapeutic purgation for eliminating excess Pitta from the body. Effective for skin diseases, liver disorders, and digestive issues.",
            workflow=[
                TherapyWorkflowStep(id="vi1", step=1, action="Snehapana (Internal Oleation)", duration="3-7 Days", notes="Medicated ghee administration", requiredMaterials=[RequiredMaterial(name="Medicated Ghee", quantity="500", unit="ml")], precautions=["Monitor stool consistency"]),
                TherapyWorkflowStep(id="vi2", step=2, action="Abhyanga & Swedana", duration="3 Days", notes="Oil massage and sudation therapy", requiredMaterials=[RequiredMaterial(name="Mahanarayan Oil", quantity="300", unit="ml")], precautions=["Ensure adequate hydration"]),
                TherapyWorkflowStep(id="vi3", step=3, action="Virechana Karma", duration="1 Day", notes="Administration of purgative medicine", requiredMaterials=[RequiredMaterial(name="Trivrit Lehya", quantity="50", unit="g")], precautions=["Keep ORS ready", "Monitor dehydration"]),
                TherapyWorkflowStep(id="vi4", step=4, action="Samsarjana Krama", duration="3-7 Days", notes="Post-purgation diet regimen", requiredMaterials=[], precautions=["Graduated return to normal diet"]),
            ],
            contraindications=["Rectal prolapse", "Bleeding disorders", "Pregnancy", "Diarrhea", "Severe weakness"],
            safetyNotes="Monitor hydration levels carefully. Ensure electrolyte balance is maintained post-procedure.",
            documents=[],
        ),
        TherapyDefinition(
            tid="t3",
            name="Basti",
            description="Medicated enema therapy considered the most important Panchakarma procedure. Used for Vata disorders, neurological conditions, and musculoskeletal issues.",
            workflow=[
                TherapyWorkflowStep(id="b1", step=1, action="Purva Karma (Preparation)", duration="1 Day", notes="Local abhyanga and swedana to the abdomen", requiredMaterials=[RequiredMaterial(name="Sesame Oil", quantity="100", unit="ml")], precautions=["Check for anal fissures"]),
                TherapyWorkflowStep(id="b2", step=2, action="Niruha Basti (Decoction Enema)", duration="1 Day", notes="Administration of herbal decoction enema", requiredMaterials=[RequiredMaterial(name="Dashamoola Decoction", quantity="500", unit="ml"), RequiredMaterial(name="Honey", quantity="50", unit="ml")], precautions=["Ensure proper temperature", "Monitor retention time"]),
                TherapyWorkflowStep(id="b3", step=3, action="Anuvasana Basti (Oil Enema)", duration="1 Day", notes="Administration of medicated oil enema", requiredMaterials=[RequiredMaterial(name="Medicated Sesame Oil", quantity="100", unit="ml")], precautions=["Check oil temperature"]),
            ],
            contraindications=["Intestinal obstruction", "Rectal bleeding", "Severe diarrhea", "Childhood < 7 years"],
            safetyNotes="Basti should be administered in proper position. Ensure all equipment is sterilized.",
            documents=[],
        ),
        TherapyDefinition(
            tid="t4",
            name="Nasya",
            description="Nasal administration of medicated oils and herbal preparations. Used for ENT disorders, neurological conditions, and head-related ailments.",
            workflow=[
                TherapyWorkflowStep(id="n1", step=1, action="Facial Oil Massage", duration="15 Minutes", notes="Gentle massage to face, forehead, and neck", requiredMaterials=[RequiredMaterial(name="Anu Taila", quantity="20", unit="ml")], precautions=["Avoid pressure on eyes"]),
                TherapyWorkflowStep(id="n2", step=2, action="Steam Fomentation", duration="10 Minutes", notes="Steam application to face and neck area", requiredMaterials=[RequiredMaterial(name="Herbal Steam Pack", quantity="1", unit="pc")], precautions=["Maintain safe distance"]),
                TherapyWorkflowStep(id="n3", step=3, action="Nasya Karma", duration="15 Minutes", notes="Instillation of medicated oil into nostrils", requiredMaterials=[RequiredMaterial(name="Anu Taila", quantity="10", unit="ml")], precautions=["Patient should be supine", "Head tilted back"]),
                TherapyWorkflowStep(id="n4", step=4, action="Post-procedure Gargling", duration="5 Minutes", notes="Warm water gargling to clear residual medication", requiredMaterials=[], precautions=["Monitor for any adverse reactions"]),
            ],
            contraindications=["Acute cold with nasal congestion", "After meals", "Children under 7", "During menstruation"],
            safetyNotes="Ensure patient is comfortable in supine position. Monitor for any respiratory distress.",
            documents=[],
        ),
        TherapyDefinition(
            tid="t5",
            name="Raktamokshana",
            description="Therapeutic bloodletting for blood purification. Used for skin diseases, joint inflammation, and toxin-related conditions.",
            workflow=[
                TherapyWorkflowStep(id="r1", step=1, action="Patient Assessment", duration="30 Minutes", notes="Evaluate patient fitness and identify site for procedure", requiredMaterials=[], precautions=["Check hemoglobin levels", "Rule out bleeding disorders"]),
                TherapyWorkflowStep(id="r2", step=2, action="Local Preparation", duration="15 Minutes", notes="Clean and prepare the site", requiredMaterials=[RequiredMaterial(name="Antiseptic Solution", quantity="50", unit="ml"), RequiredMaterial(name="Sterile Gauze", quantity="5", unit="pcs")], precautions=["Strict aseptic technique"]),
                TherapyWorkflowStep(id="r3", step=3, action="Raktamokshana Procedure", duration="30 Minutes", notes="Controlled bloodletting using appropriate method", requiredMaterials=[RequiredMaterial(name="Leech/Instruments", quantity="1", unit="set")], precautions=["Monitor blood loss", "Watch for vasovagal response"]),
                TherapyWorkflowStep(id="r4", step=4, action="Post-procedure Care", duration="30 Minutes", notes="Wound dressing and observation", requiredMaterials=[RequiredMaterial(name="Sterile Dressing", quantity="2", unit="pcs")], precautions=["Pressure dressing if needed"]),
            ],
            contraindications=["Anemia", "Bleeding disorders", "Pregnancy", "Children", "Generalized edema"],
            safetyNotes="Strict aseptic technique is mandatory. Monitor blood loss carefully. Keep hemostatic agents ready.",
            documents=[],
        ),
    ]


def get_therapy_plans():
    return [
        TherapyPlanDefinition(
            tpid="tp1",
            name="Basic Detox Program",
            description="A foundational 7-day Panchakarma detox program suitable for beginners, focusing on gentle cleansing therapies.",
            duration="7 days",
            totalSessions=5,
            difficulty="Beginner",
            status="Active",
            therapySequence=[
                TherapySequenceItem(id="seq1", therapyName="Abhyanga", day="Day 1-2", sessions=2, notes="Full body oil massage for oleation", status="completed"),
                TherapySequenceItem(id="seq2", therapyName="Swedana", day="Day 3", sessions=1, notes="Steam therapy post-massage", status="in-progress"),
                TherapySequenceItem(id="seq3", therapyName="Virechana", day="Day 5", sessions=1, notes="Mild purgation therapy", status="pending"),
                TherapySequenceItem(id="seq4", therapyName="Basti", day="Day 7", sessions=1, notes="Medicated enema for Vata balance", status="pending"),
            ],
            assignedPatients=12,
            createdDate="2025-01-15",
            tags=["Detox", "Beginner", "7-Day"],
        ),
        TherapyPlanDefinition(
            tpid="tp2",
            name="Advanced Rejuvenation",
            description="A comprehensive 14-day intensive Panchakarma program for deep tissue cleansing and rejuvenation.",
            duration="14 days",
            totalSessions=12,
            difficulty="Advanced",
            status="Active",
            therapySequence=[
                TherapySequenceItem(id="seq5", therapyName="Snehapana", day="Day 1-5", sessions=5, notes="Internal oleation with medicated ghee", status="completed"),
                TherapySequenceItem(id="seq6", therapyName="Vamana", day="Day 7", sessions=1, notes="Therapeutic emesis", status="in-progress"),
                TherapySequenceItem(id="seq7", therapyName="Virechana", day="Day 9", sessions=1, notes="Therapeutic purgation", status="pending"),
                TherapySequenceItem(id="seq8", therapyName="Basti", day="Day 11-13", sessions=3, notes="Series of medicated enemas", status="pending"),
                TherapySequenceItem(id="seq9", therapyName="Nasya", day="Day 14", sessions=2, notes="Nasal therapy for head cleansing", status="pending"),
            ],
            assignedPatients=6,
            createdDate="2025-02-01",
            tags=["Advanced", "Rejuvenation", "14-Day"],
        ),
        TherapyPlanDefinition(
            tpid="tp3",
            name="Joint & Spine Care",
            description="Specialized 10-day plan targeting musculoskeletal issues with focused Basti and external therapies.",
            duration="10 days",
            totalSessions=8,
            difficulty="Moderate",
            status="Active",
            therapySequence=[
                TherapySequenceItem(id="seq10", therapyName="Abhyanga", day="Day 1-3", sessions=3, notes="Targeted joint massage", status="completed"),
                TherapySequenceItem(id="seq11", therapyName="Kati Basti", day="Day 4-5", sessions=2, notes="Localized oil pooling on lower back", status="pending"),
                TherapySequenceItem(id="seq12", therapyName="Basti", day="Day 7-9", sessions=3, notes="Medicated enema series", status="pending"),
            ],
            assignedPatients=9,
            createdDate="2025-02-10",
            tags=["Joint Care", "Spine", "Moderate"],
        ),
        TherapyPlanDefinition(
            tpid="tp4",
            name="Respiratory Wellness",
            description="Focused 5-day program for respiratory conditions using Vamana and Nasya therapies.",
            duration="5 days",
            totalSessions=4,
            difficulty="Moderate",
            status="Draft",
            therapySequence=[
                TherapySequenceItem(id="seq13", therapyName="Nasya", day="Day 1-2", sessions=2, notes="Nasal cleansing therapy", status="pending"),
                TherapySequenceItem(id="seq14", therapyName="Vamana", day="Day 4", sessions=1, notes="Therapeutic emesis for Kapha", status="pending"),
                TherapySequenceItem(id="seq15", therapyName="Dhumapana", day="Day 5", sessions=1, notes="Herbal smoking therapy", status="pending"),
            ],
            assignedPatients=3,
            createdDate="2025-03-01",
            tags=["Respiratory", "Kapha", "5-Day"],
        ),
    ]


def get_therapists():
    return [
        Therapist(thid="th1", name="Dr. Lakshmi Nair", status="Available", specialty="Vamana & Virechana", role="Senior Therapist", skills=["Vamana", "Virechana", "Abhyanga", "Snehapana"], shifts=["Mon", "Tue", "Wed", "Thu", "Fri"]),
        Therapist(thid="th2", name="Rajesh Kumar", status="Available", specialty="Basti Therapy", role="Therapist", skills=["Basti", "Abhyanga", "Swedana"], shifts=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
        Therapist(thid="th3", name="Priya Sharma", status="Busy", specialty="Nasya & External Therapies", role="Therapist", skills=["Nasya", "Shirodhara", "Abhyanga"], shifts=["Mon", "Wed", "Fri", "Sat"]),
        Therapist(thid="th4", name="Anil Menon", status="Available", specialty="Raktamokshana", role="Junior Therapist", skills=["Raktamokshana", "Leech Therapy", "Abhyanga"], shifts=["Tue", "Thu", "Sat"]),
    ]


def get_rooms():
    return [
        Room(rid="room1", name="Therapy Room A", capacity=2, facilities=["Oil Massage Table", "Steam Unit", "Drainage System"], status="Available"),
        Room(rid="room2", name="Therapy Room B", capacity=2, facilities=["Massage Table", "Steam Unit", "Enema Equipment"], status="Available"),
        Room(rid="room3", name="Steam Room", capacity=4, facilities=["Steam Generator", "Herbal Infuser", "Temperature Control"], status="Available"),
        Room(rid="room4", name="Consultation Room", capacity=3, facilities=["Examination Table", "Computer System", "Storage Cabinet"], status="Available"),
    ]


def get_materials():
    return [
        Material(mid="mat1", name="Sesame Oil", quantity=50, unit="liters", lowStockThreshold=10),
        Material(mid="mat2", name="Mahanarayan Oil", quantity=25, unit="liters", lowStockThreshold=5),
        Material(mid="mat3", name="Dashamoola Herbs", quantity=30, unit="kg", lowStockThreshold=5),
        Material(mid="mat4", name="Steam Towels", quantity=100, unit="pieces", lowStockThreshold=20),
        Material(mid="mat5", name="Madanaphala Powder", quantity=5, unit="kg", lowStockThreshold=2),
    ]


def get_users():
    return [
        User(uid="u1", name="Admin User", email="admin@panchakarma.com", username="admin", password_hash=hash_password("admin@2024"), role="Admin"),
        User(uid="u2", name="Dr. Anand Sharma", email="doctor@panchakarma.com", username="doctor", password_hash=hash_password("doctor@2024"), role="Physician"),
        User(uid="u3", name="Therapist Priya", email="therapist@panchakarma.com", username="therapist", password_hash=hash_password("therapist@2024"), role="Therapist"),
        User(uid="u4", name="Staff Member", email="staff@panchakarma.com", username="staff", password_hash=hash_password("staff@2024"), role="Staff"),
    ]


def generate_audit_logs():
    logs = []
    actions = ["LOGIN", "VIEW", "CREATE", "UPDATE", "SCHEDULE", "UPLOAD"]
    entities = ["Patient", "Schedule", "Therapy", "Document", "User"]
    users = ["Admin User", "Dr. Anand Sharma", "Therapist Priya", "Staff Member"]
    base_date = datetime(2025, 3, 1, 8, 0, tzinfo=timezone.utc)

    for i in range(45):
        ts = base_date + timedelta(hours=i * 4, minutes=i * 13 % 60)
        action = actions[i % len(actions)]
        entity = entities[i % len(entities)]
        user = users[i % len(users)]
        logs.append(AuditLog(
            aid=f"audit-{i+1:03d}",
            userId=i % 4 + 1,
            userName=user,
            action=action,
            entity=entity,
            entityId=f"{entity[0].lower()}{i % 10 + 1}",
            details=f"{user} performed {action} on {entity}",
            timestamp=ts.isoformat(),
            ipAddress=f"192.168.1.{100 + i % 50}",
        ))
    return logs


def generate_schedule_entries():
    entries = []
    therapy_types = ["Vamana", "Virechana", "Basti", "Nasya", "Raktamokshana"]
    therapist_ids = ["th1", "th2", "th3", "th4"]
    room_ids = ["room1", "room2", "room3"]
    base_date = datetime(2025, 3, 15, 9, 0, tzinfo=timezone.utc)

    for i in range(20):
        day_offset = i // 3
        hour_offset = (i % 3) * 2
        start = base_date + timedelta(days=day_offset, hours=hour_offset)
        end = start + timedelta(hours=1, minutes=30)
        therapy = therapy_types[i % len(therapy_types)]
        entries.append(ScheduleEntry(
            sid=f"s{i+1}",
            title=f"{therapy} - Patient p{i+1}",
            start=start.isoformat(),
            end=end.isoformat(),
            resourceId=room_ids[i % len(room_ids)],
            therapistId=therapist_ids[i % len(therapist_ids)],
            patientId=f"p{i+1}",
            type=therapy,
            status="Scheduled" if i > 10 else "Completed",
        ))
    return entries


from app.models.resource import Room


async def seed(force: bool = False):
    await init_db()

    # Check if already seeded
    existing_users = await User.count()
    if existing_users > 0 and not force:
        print("Database already seeded. Use --force to reseed.")
        await close_db()
        return

    if force:
        print("Force reseeding - clearing all collections...")
        for model in [User, Patient, TherapyDefinition, TherapyPlanDefinition,
                      Therapist, Room, Material, AuditLog, ScheduleEntry]:
            await model.find_all().delete()

    # Seed users
    users = get_users()
    for u in users:
        await u.insert()
    print(f"Seeded {len(users)} users")

    # Seed patients (100)
    patients = [generate_patient(i) for i in range(100)]
    for p in patients:
        await p.insert()
    print(f"Seeded {len(patients)} patients")

    # Seed therapies
    therapies = get_therapies()
    for t in therapies:
        await t.insert()
    print(f"Seeded {len(therapies)} therapy definitions")

    # Seed therapy plans
    plans = get_therapy_plans()
    for p in plans:
        await p.insert()
    print(f"Seeded {len(plans)} therapy plans")

    # Seed therapists
    therapists = get_therapists()
    for t in therapists:
        await t.insert()
    print(f"Seeded {len(therapists)} therapists")

    # Seed rooms
    rooms = get_rooms()
    for r in rooms:
        await r.insert()
    print(f"Seeded {len(rooms)} rooms")

    # Seed materials
    materials = get_materials()
    for m in materials:
        await m.insert()
    print(f"Seeded {len(materials)} materials")

    # Seed audit logs
    audit_logs = generate_audit_logs()
    for log in audit_logs:
        await log.insert()
    print(f"Seeded {len(audit_logs)} audit logs")

    # Seed schedule entries
    entries = generate_schedule_entries()
    for e in entries:
        await e.insert()
    print(f"Seeded {len(entries)} schedule entries")

    print("\nSeeding complete!")
    print("Demo credentials:")
    print("  Admin:     username: admin / password: admin@2024")
    print("  Physician: username: doctor / password: doctor@2024")
    print("  Therapist: username: therapist / password: therapist@2024")
    print("  Staff:     username: staff / password: staff@2024")

    await close_db()


if __name__ == "__main__":
    force = "--force" in sys.argv
    asyncio.run(seed(force))
