# import asyncio
# import aiohttp
# from typing import List

# from src.service.key import get_key

# # Giới hạn số request đồng thời
# semaphore = asyncio.Semaphore(50)

# async def fetch(session: aiohttp.ClientSession, url: str):
#     async with semaphore:
#         try:
#             async with session.get(url) as response:
#                 response.raise_for_status()
#                 return await response.json()
#         except Exception as e:
#             return {"error": str(e), "url": url}

# async def fetch_ids(session: aiohttp.ClientSession, url: str):
#     authorization = get_key("key_v3")
#     async with semaphore:
#         try:
#             async with session.get(url, headers={"authorization": authorization}) as response:
#             # async with session.get(url) as response:
#                 response.raise_for_status()
#                 data = await response.json()
#                 print(data)
#                 return [item['id'] for item in data['data']['content']]
#         except Exception as e:
#             return {"error": str(e), "url": url}

# async def fetch_all(urls: List[str], handler):
#     connector = aiohttp.TCPConnector(limit=100)
#     timeout = aiohttp.ClientTimeout(total=30)
#     async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
#         tasks = [handler(session, url) for url in urls]
#         return await asyncio.gather(*tasks, return_exceptions=True)

# async def get_manhole_details(manhole_object_ids: List[str]):
#     # Tạo URL để lấy danh sách ID
#     search_urls = [
#         f"http://uat.bitecco.vn:8700/v1/auxiliary/manhole/search?page=0&size=500&date=&objectType=ROAD&objectIds={oid}"
#         for oid in manhole_object_ids
#     ]
#     id_results = await fetch_all(search_urls, fetch_ids)

#     # Gộp tất cả id thành một danh sách
#     all_ids = [mid for sublist in id_results if isinstance(sublist, list) for mid in sublist]

#     # Tạo URL chi tiết từ các id
#     detail_urls = [
#         f"http://uat.bitecco.vn:8700/v1/auxiliary/manhole/detail/{mid}"
#         for mid in all_ids
#     ]
#     detail_results = await fetch_all(detail_urls, fetch)

#     # Lọc và định dạng kết quả
#     return [
#         {
#             "id": m['data']['id'],
#             "process": m['data']['name'],
#             "distance_0km": int(m['data']['distanceToKm0']),
#             "form_date": m['data']['startDate'],
#             "position": m['data']['positionName'],
#             "manhole_type": m['data']['subType']['name'],
#             "road_edge_distance": m['data']['roadEdgeDistance'],
#             "size": m['data']['size'],
#             "status": m['data']['statusName'],
#             "to_date": m['data']['endDate'],
#             "object_name": m['data']['objectName']
#         }
#         for m in detail_results
#         if isinstance(m, dict) and 'data' in m
#     ]

# if __name__ == "__main__":
#     import asyncio
#     result = asyncio.run(get_manhole_details(["1923", "3201", "3199"]))
#     print(result)

# from typing import Union
# from fastapi import APIRouter
# from pydantic import BaseModel

# router = APIRouter()

# class ManholeA(BaseModel):
#     id: int
#     name: str

# class ManholeB(BaseModel):
#     id: int
#     depth: float
#     material: str

# @router.post("/update-manhole-v3")
# async def update_manhole_v3(manhole: Union[ManholeA, ManholeB]):
#     if isinstance(manhole, ManholeA):
#         return await put_manhole_a(manhole)
#     elif isinstance(manhole, ManholeB):
#         return await put_manhole_b(manhole)


# def build_post_manhole_payload(manhole: Union[ManholeA, ManholeB], key: str) -> dict:
#     if key == "a" and isinstance(manhole, ManholeA):
#         return {
#             "start": manhole.date_from,
#             "end": manhole.date_to,
#             "type": manhole.type,
#         }
#     elif key == "b" and isinstance(manhole, ManholeB):
#         return {
#             "timestamp": manhole.timestamp,
#             "location": manhole.coordinates,
#             "meta": manhole.meta,
#         }
#     else:
#         raise ValueError(f"Unsupported combination of key '{key}' and manhole type '{type(manhole)}'")

# manhole_schemas.py

from datetime import datetime
from typing import Dict, List, Union
from models import ManholeCreate  # import đúng class

# --- 1. parse_manhole_detail ---
def parse_manhole_detail_key_1(data: dict) -> dict:
    return {
        "id":  data['data']['id'],
        "name": data['data']['name'],
        "name_object_id": data['data']['roadFaceDistance']['id'],
        "organization_id": data['data']['organizationId'],
        "form_date": data['data']['startDate'],
        "to_date": data['data']['endDate'],
        "object_type": data['data']['objectType'],
        "object_name": f"{data['data']['objectName']}({data['data']['roadFaceDistance']['range']} - {data['data']['roadFaceDistance']['range'] + data['data']['roadFaceDistance']['longs']})",
        "distance_0km": data['data']['distanceToKm0'],
        "road_edge_distance": data['data']['roadEdgeDistance'],
        "position": data['data']['position'],
        "manhole_type_id": data['data']['subTypeId'],
        "size": data['data']['size'],
        "status_id": data['data']['statusId'],
        "coordinates": data['data']['coordinates'],
        "description": data['data']['description'],
        "m": data
    }

# --- 2. parse_manhole_data ---
def parse_manhole_data_key_1(data: dict) -> List[dict]:
    results = []
    for m in data.get("data", []):
        dt = datetime.strptime(m['ngayApDung'], "%Y-%m-%dT%H:%M:%S.%fZ")
        results.append({
            "id": m['id'],
            "process": m['lyTrinh'],
            "distance_0km": m['lyTrinh_khoangCach'],
            "form_date": dt.strftime("%d/%m/%Y"),
            "position": m['tenViTri'],
            "manhole_type": m['tenLoaiHoGa'],
            "road_edge_distance": m['khoangCachMepDuong'],
            "size": m['kichThuoc'],
            "status": m['tenTinhTrang'],
            "to_date": m['ngayKetThuc'],
            "object_name": m['tenDoanDuong'],
        })
    return results

# --- 3. format_manhole_detail ---
def format_manhole_detail_key_1(data: dict) -> dict:
    return {
        "id": data['id'],
        "process": data['name'],
        "distance_0km": float(data['distanceToKm0']),
        "form_date": data['startDate'],
        "position": data['positionName'],
        "manhole_type": data['subType']['name'],
        "road_edge_distance": data['roadEdgeDistance'],
        "size": data['size'],
        "status": data['statusName'],
        "to_date": data['endDate'],
        "object_name": f"{data['objectName']}({data['roadFaceDistance']['range']} - {data['roadFaceDistance']['range'] + data['roadFaceDistance']['longs']})"
    }

# --- 4. build_post_manhole_payload ---
def build_post_payload_key_1(m: ManholeCreate) -> dict:
    return {
        "startDate": m.form_date,
        "endDate": m.to_date,
        "objectType": m.object_type,
        "nameObjectId": m.name_object_id,
        "organizationId": m.organization_id,
        "distanceToKm0": m.distance_0km,
        "roadEdgeDistance": m.road_edge_distance,
        "position": m.position,
        "subTypeId": m.manhole_type_id,
        "size": m.size,
        "statusId": m.status_id,
        "coordinates": m.coordinates,
        "description": m.description,
        "roadFaceDistanceId": m.name_object_id,
    }

# --- 5. build_put_manhole_payload ---
def build_put_payload_key_1(m: ManholeCreate) -> dict:
    return {
        "name": m.name,
        "startDate": m.form_date,
        "endDate": m.to_date,
        "objectType": m.object_type,
        "nameObjectId": m.name_object_id,
        "organizationId": m.organization_id,
        "distanceToKm0": m.distance_0km,
        "roadEdgeDistance": m.road_edge_distance,
        "position": m.position,
        "subTypeId": m.manhole_type_id,
        "size": m.size,
        "statusId": m.status_id,
        "coordinates": m.coordinates,
        "description": m.description,
        "roadFaceDistanceId": m.name_object_id,
        "id": m.id,
    }

# --- 6. payload_craw_manhole ---
def build_craw_payload_key_1(id: int) -> dict:
    return {
        "id_doanDuong": id,
        "lyTrinh": 0,
        "id_loaiHoGa": 0,
        "id_tinhTrang": 0,
        "id_viTri": 0,
        "ngay": "2025/10/01"
    }

# --- DISPATCH TABLES ---
parse_detail_dispatch = {
    "1": parse_manhole_detail_key_1,
}

parse_data_dispatch = {
    "1": parse_manhole_data_key_1,
}

format_detail_dispatch = {
    "1": format_manhole_detail_key_1,
}

post_payload_dispatch = {
    "1": build_post_payload_key_1,
}

put_payload_dispatch = {
    "1": build_put_payload_key_1,
}

craw_payload_dispatch = {
    "1": build_craw_payload_key_1,
}