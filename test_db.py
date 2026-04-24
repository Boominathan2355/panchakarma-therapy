import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv

load_dotenv(dotenv_path='server/.env')

async def test_connection():
    uri = os.getenv("MONGODB_URL")
    print(f"Testing connection to: {uri[:20]}...")
    client = AsyncIOMotorClient(uri)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
