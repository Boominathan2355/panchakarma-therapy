# Panchakarma Therapy Automation System (PTAS)

A web-based therapy automation system for Panchakarma - an Ayurvedic healthcare management platform that digitizes therapy protocols using LLMs and optimizes scheduling with hybrid algorithms (GA + PSO).

**IEEE Conference Paper Implementation** | Dr. Mahalingam College of Engineering and Technology

## Architecture

```
Browser  -->  React Client (:5173)  -->  FastAPI Server (:8000)  -->  MongoDB Atlas
                                              |
                                    HuggingFace LLM API
                                    Tesseract OCR
                                    FAISS Vector Search
```

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Boominathan2355/panchakarma-therapy.git
cd panchakarma-therapy

# 2. Install
make install

# 3. Configure backend
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URL and JWT secret

# 4. Seed database
make seed

# 5. Run (two terminals)
make dev-server   # Terminal 1: Backend on :8000
make dev-client   # Terminal 2: Frontend on :5173
```

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin@2024 |
| Physician | doctor | doctor@2024 |
| Therapist | therapist | therapist@2024 |
| Staff | staff | staff@2024 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Redux Toolkit, Vite |
| Backend | FastAPI, Python 3.11, Beanie ODM |
| Database | MongoDB Atlas |
| AI/ML | HuggingFace Inference API, Sentence-Transformers, FAISS |
| OCR | Tesseract, PyPDF2, python-docx |
| Scheduling | Genetic Algorithm + Particle Swarm Optimization |
| CI/CD | GitHub Actions, Vercel (frontend), Render (backend) |

## Project Structure

```
panchakarma-therapy/
├── client/          # React frontend
├── server/          # FastAPI backend
├── docs/            # Architecture, API docs, deployment guide
├── .github/         # CI/CD workflows
└── Makefile         # Common commands
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for details.

## Core Algorithms (from IEEE paper)

**Algorithm 1 - LLM Document Processing:** Upload therapy protocol PDFs/DOCs, extract text (OCR for scanned), send to LLM for structured JSON, generate semantic embeddings for search.

**Algorithm 2 - Hybrid Scheduling:** Rule-based constraint validation + Genetic Algorithm optimization + Particle Swarm refinement + Priority-based emergency handling.

## License

MIT
