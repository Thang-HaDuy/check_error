from typing import List
from fastapi import APIRouter, Depends, HTTPException

from fastapi import Query
from src.schema.manhole import Manhole, ManholeCreate
from src.service.manhole import craw_manhole, craw_manhole_detal_v3, post_manhole_v3, put_manhole_v3


router = APIRouter()


@router.get("/compare-manholes")
async def compare_manholes(v1: str = None, v3: List[str] = Query([])):
    return await craw_manhole(v1, v3)

@router.get("/get-manhole-detal-v3")
async def get_manhole_detal_v3(id: str = None):
    try:
        return await craw_manhole_detal_v3(id)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/update-manhole-v3")
async def update_manhole_v3(manhole: Manhole):
    return await put_manhole_v3(manhole)


@router.post("/create-manhole-v3")
async def create_manhole_v3(manhole: ManholeCreate):
    return await post_manhole_v3(manhole)