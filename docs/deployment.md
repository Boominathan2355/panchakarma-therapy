# Deployment Guide

## Prerequisites

- MongoDB Atlas account (free M0 cluster)
- Vercel account (frontend)
- Render account (backend)
- HuggingFace account (optional, for LLM features)

## MongoDB Atlas Setup

1. Create free M0 cluster at mongodb.com/cloud/atlas
2. Create database user
3. Allow network access from anywhere (0.0.0.0/0)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ptas`

## Backend (Render)

1. Connect GitHub repo to Render
2. Set root directory: `server`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables (see server/.env.example)
6. Seed database: Run `python seed_data.py` via Render shell

## Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your Render backend URL

## Environment Variables Checklist

### Server (Render)
- MONGODB_URL
- JWT_SECRET (generate a secure random string)
- CORS_ORIGINS (include your Vercel frontend URL)
- HF_API_TOKEN (optional)

### Client (Vercel)
- VITE_API_URL (your Render backend URL + /api)
