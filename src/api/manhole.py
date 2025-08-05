from typing import List, Union
from fastapi import APIRouter, Body, Depends, HTTPException, Request

from fastapi import Query
from src.schema.manhole import BodyData11, ExitRamp, Manhole, ManholeCreate
from src.service.manhole import craw_manhole, craw_manhole_detal_v3, post_manhole_v3, put_manhole_v3


router = APIRouter()


@router.get("/compare-manholes")
async def compare_manholes(v1: str, v3: List[str] = Query([]), key: str = "1"):
    return await craw_manhole(v1, v3, key)

@router.get("/get-manhole-detal-v3")
async def get_manhole_detal_v3(id: str, key: str):
    try:
        return await craw_manhole_detal_v3(id, key)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/update-manhole-v3")
async def update_manhole_v3(request: Request, key: str):
    manhole = await request.json()  # Lấy raw body không kiểm tra type
    return await put_manhole_v3(manhole, key)

@router.post("/create-manhole-v3")
async def create_manhole_v3(manhole: Union[ManholeCreate], key: str):
    return await post_manhole_v3(manhole, key)