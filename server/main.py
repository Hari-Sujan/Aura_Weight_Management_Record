from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from server.database import get_master_data, update_master_data

app = FastAPI(title="Aura Wellness MongoDB API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/database")
def get_db():
    try:
        data = get_master_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/database")
def save_db(payload: Dict[str, Any]):
    try:
        updated = update_master_data(payload)
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
