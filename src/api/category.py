import aiohttp
from fastapi import APIRouter, HTTPException

from src.service.key import get_key

from src.service.utlis import culvertApertureId8

router = APIRouter()

@router.get("/get-category")
async def get_category(cate: str):
    try:
        url = f"http://uat.bitecco.vn:8700/v1/category/{cate}?page=0&size=1000"
        authorization = get_key("key_v3")
        async with aiohttp.ClientSession() as session:
            async with session.get(url, json={"authorization": authorization}) as response:
                response.raise_for_status()
                json_data = await response.json()
        return [
            {
                "id": c['id'],
                "name": c['name']
            } for c in json_data['data']['content']
        ]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
async def GetCategory():
    try:
        url = f"http://uat.bitecco.vn:8700/v1/category/culvert-span-type?page=0&size=1000"
        authorization = get_key("key_v3")
        async with aiohttp.ClientSession() as session:
            async with session.get(url, json={"authorization": authorization}) as response:
                response.raise_for_status()
                json_data = await response.json()
        for c in json_data['data']['content']:
            culvertApertureId8[c["id"]] = c['name']
        
    except Exception as e:
        print(e)
