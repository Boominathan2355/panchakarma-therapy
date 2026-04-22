.PHONY: dev-client dev-server seed test lint build install

install:
	cd client && npm install
	cd server && pip install -r requirements.txt

dev-client:
	cd client && npm run dev

dev-server:
	cd server && ./.venv/bin/python -m uvicorn app.main:app --reload --port 8000

seed:
	cd server && ./.venv/bin/python seed_data.py

test:
	cd server && ./.venv/bin/python -m pytest tests/ -v

lint:
	cd client && npm run lint
	cd client && npm run type-check

build:
	cd client && npm run build
