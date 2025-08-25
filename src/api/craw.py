from typing import List
from fastapi import APIRouter, Depends, HTTPException

from src.schema.craw import CrawDistance
from src.service.craw import craw_distance_v1, craw_distance_v3

router = APIRouter()

@router.get("/craw-distance-v1")
async def craw_data_distance():
    try:
        return craw_distance_v1()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/craw-distance-v3")
async def craw_data_distance(name: str = None):
    try:
        return await craw_distance_v3(name)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))