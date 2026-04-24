from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models import ALL_MODELS

client: AsyncIOMotorClient = None


async def init_db():
    global client
    # MongoDB Atlas connections need proper TLS configuration
    mongodb_url = settings.MONGODB_URL
    
    client = AsyncIOMotorClient(
        mongodb_url,
        serverSelectionTimeoutMS=30000,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    db_name = settings.MONGODB_URL.split("/")[-1].split("?")[0] or "ptas"
    database = client[db_name]
    await init_beanie(database=database, document_models=ALL_MODELS)


async def close_db():
    global client
    if client:
        client.close()
