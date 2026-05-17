'''

Entry point to the server. 
Serves the app and provides the poret on which we will be running the server

'''
from app import app
from dotenv import load_dotenv
import os
import uvicorn

load_dotenv()

if __name__ == "__main__":
    print("🚀 Starting LeetCode Tracker API...")
    print("📝 Docs available at: http://localhost:8000/docs")
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENVIRONMENT", "development") == "development"

    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )