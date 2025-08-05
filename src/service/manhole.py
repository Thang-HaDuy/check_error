from typing import Any, Dict, List, Union

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from src.schema.manhole import BodyData11, ExitRamp, Manhole, ManholeCreate
from src.service.key import get_key
from datetime import datetime
import aiohttp
import asyncio
from src.service.key import get_key
from src.service.data_set import data_handlers
from collections import defaultdict

async def craw_manhole(v1, v3, key):
    v1_task = asyncio.create_task(craw_manhole_v1(v1, key))
    v3_task = asyncio.create_task(get_manhole_details(v3, key))

    v1_data, v3_data = await asyncio.gather(v1_task, v3_task)

    merged = group_by_distance_position_and_edge(v1_data, v3_data)

    return merged


def group_by_distance_position_and_edge(v1_data, v3_data):
    groups = defaultdict(dict)

    for obj in v1_data:
        obj["_source"] = "v1"
        key = (obj["distance_0km"], obj["position"], obj["road_edge_distance"])
        groups[key]["v1"] = obj

    for obj in v3_data:
        obj["_source"] = "v3"
        key = (obj["distance_0km"], obj["position"], obj["road_edge_distance"])
        groups[key]["v3"] = obj

    return sorted(
        groups.values(),
        key=lambda group: group.get("v1", group.get("v3"))["distance_0km"]
    )


async def craw_manhole_v1(id: int, key: str) -> List[dict]:
    x_access_token = get_key("key_v1")
    url = data_handlers[key]["urls"]["v1"]
    headers = {
        "x-access-permission": data_handlers[key]["x_access_permission"],
        "x-access-token": x_access_token,
        "Content-Type": "application/json"
    }
    payload = data_handlers[key]["craw_payload"](id)

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                print(f"Status: {response.status}")
                text = await response.text()

                if response.status >= 400:
                    print(f"Error response text: {text}")
                    response.raise_for_status()

                data = await response.json()
    except aiohttp.ClientResponseError as e:
        print(f"Client response error: {e.status} - {e.message}")
    except aiohttp.ClientError as e:
        print(f"Aiohttp client error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    else:
        return data_handlers[key]["parse_list"](data)

    return []

async def craw_manhole_detal_v3(id: int, key: str) -> List[dict]:
    try:
        url = f"{data_handlers[key]["urls"]["detail"]}{id}"
        authorization = get_key("key_v3")

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers={"authorization": authorization}) as response:
                response.raise_for_status()
                data = await response.json()
    except aiohttp.ClientResponseError as e:
        print(f"Client response error: {e.status} - {e.message}")
    except aiohttp.ClientError as e:
        print(f"Aiohttp client error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    else:
        return data_handlers[key]["parse_detail"](data)

semaphore = asyncio.Semaphore(50)  # điều chỉnh số lượng request đồng thời

async def fetch(session: aiohttp.ClientSession, url: str):
    async with semaphore:
        try:
            async with session.get(url) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            return {"error": str(e), "url": url}

async def fetch_ids(session: aiohttp.ClientSession, url: str):
    authorization = get_key("key_v3")
    async with semaphore:
        try:
            async with session.get(url, headers={"authorization": authorization}) as response:
                response.raise_for_status()
                data = await response.json()
                return [item['id'] for item in data['data']['content']]
        except Exception as e:
            return {"error": str(e), "url": url}

async def fetch_all(urls: List[str], handler):
    connector = aiohttp.TCPConnector(limit=100)
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        tasks = [handler(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)


async def get_manhole_details(manhole_object_ids: List[str], key: str):
    search_urls = [f"{data_handlers[key]["urls"]["search"]}{oid}" for oid in manhole_object_ids]
    id_results = await fetch_all(search_urls, fetch_ids)
    all_ids = [mid for sublist in id_results if isinstance(sublist, list) for mid in sublist]

    detail_urls = [f"{data_handlers[key]["urls"]["detail"]}{mid}" for mid in all_ids]
    detail_results = await fetch_all(detail_urls, fetch)
    # print(detail_results)
    return [
        data_handlers[key]["format_detail"](m)
        for m in detail_results
        if isinstance(m, dict) and "data" in m
    ]

async def put_manhole_v3(manhole: Any, key: str):
    try:
        url = data_handlers[key]["urls"]["change"]
        authorization = get_key("key_v3")
        payload = data_handlers[key]["build_put_payload"](manhole)
        print(payload)
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers={"authorization": authorization}) as response:
                response.raise_for_status()
                data = await response.json()
    except aiohttp.ClientResponseError as e:
        print(f"Client response error: {e.status} - {e}")
    except aiohttp.ClientError as e:
        print(f"Aiohttp client error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    else:
        return data  
    
async def post_manhole_v3(manhole: Union[ManholeCreate], key: str) -> List[dict]:
    try:
        url = data_handlers[key]["urls"]["change"]
        authorization = get_key("key_v3")
        payload =  data_handlers[key]["build_post_payload"](manhole)


        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers={"authorization": authorization}) as response:
                response.raise_for_status()
                data = await response.json()
    except aiohttp.ClientResponseError as e:
        print(f"Client response error: {e.status} - {e.message}")
    except aiohttp.ClientError as e:
        print(f"Aiohttp client error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    else:
        return data  



# async def craw_manhole_v1(id: int, key: str) -> List[dict]:
#     x_access_token = get_key("key_v1")
#     url = data_handlers[key]["urls"]["v1"]
#     x_access_permission = data_handlers[key]["x_access_permission"]
#     headers = {
#         "x-access-permission": x_access_permission,
#         "x-access-token": x_access_token,
#     }
#     payload = data_handlers[key]["craw_payload"](id)

#     async with aiohttp.ClientSession() as session:
#         async with session.post(url, json=payload, headers=headers) as response:
#             response.raise_for_status()
#             data = await response.json()

#     print(payload)
#     return data_handlers[key]["parse_list"](data)
# def parse_manhole_detal(data: dict, key: str):
#     if key == "1":
#         return {
#             "id":  data['data']['id'],
#             "name": data['data']['name'],
#             "name_object_id": data['data']['roadFaceDistance']['id'],
#             "organization_id": data['data']['organizationId'],
#             "form_date": data['data']['startDate'],
#             "to_date": data['data']['endDate'],
#             "object_type": data['data']['objectType'],
#             "object_name": f"{data['data']['objectName']}({data['data']['roadFaceDistance']['range']} - {data['data']['roadFaceDistance']['range'] + data['data']['roadFaceDistance']['longs']})",
#             "distance_0km": data['data']['distanceToKm0'],
#             "road_edge_distance": data['data']['roadEdgeDistance'],
#             "position": data['data']['position'],
#             "manhole_type_id": data['data']['subTypeId'],
#             "size": data['data']['size'],
#             "status_id": data['data']['statusId'],
#             "coordinates": data['data']['coordinates'],
#             "description": data['data']['description'],
#             "m": data
#         }
# def parse_manhole_data(data: dict, key: str) -> List[Dict]:
#     datas = []

#     for m in data.get("data", []):
#         dt = datetime.strptime(m['ngayApDung'], "%Y-%m-%dT%H:%M:%S.%fZ")
#         if key == "1":
#             t = {
#                 "id": m['id'],
#                 "process":  m['lyTrinh'],
#                 "distance_0km": m['lyTrinh_khoangCach'],
#                 "form_date": dt.strftime("%d/%m/%Y"),
#                 "position": m['tenViTri'],
#                 "manhole_type": m['tenLoaiHoGa'],
#                 "road_edge_distance": m['khoangCachMepDuong'],
#                 "size": m['kichThuoc'],
#                 "status": m['tenTinhTrang'],
#                 "to_date": m['ngayKetThuc'],
#                 "object_name": m['tenDoanDuong'],
#             }
#         else:
#             continue  # bỏ qua
#         datas.append(t)

#     return datas

# def format_manhole_detail(data: dict, key: str) -> dict:
#     if key == "1":
#         return {
#             "id": data['id'],
#             "process": data['name'],
#             "distance_0km": float(data['distanceToKm0']),
#             "form_date": data['startDate'],
#             "position": data['positionName'],
#             "manhole_type": data['subType']['name'],
#             "road_edge_distance": data['roadEdgeDistance'],
#             "size": data['size'],
#             "status": data['statusName'],
#             "to_date": data['endDate'],
#             "object_name": f"{data['objectName']}({data['roadFaceDistance']['range']} - {data['roadFaceDistance']['range'] + data['roadFaceDistance']['longs']})"
#         }
#     # Có thể thêm nhiều điều kiện hơn
#     else:
#         return {}
    
# def build_post_manhole_payload(manhole: Union[ManholeCreate], key: str) -> dict:
#     if key == "1"and isinstance(manhole, ManholeCreate):
#         return {
#             "startDate": manhole.form_date,
#             "endDate": manhole.to_date,
#             "objectType": manhole.object_type,
#             "nameObjectId": manhole.name_object_id,
#             "organizationId": manhole.organization_id,
#             "distanceToKm0": manhole.distance_0km,
#             "roadEdgeDistance": manhole.road_edge_distance,
#             "position": manhole.position,
#             "subTypeId": manhole.manhole_type_id,
#             "size": manhole.size,
#             "statusId": manhole.status_id,
#             "coordinates": manhole.coordinates,
#             "description": manhole.description,
#             "roadFaceDistanceId": manhole.name_object_id,
#         }
#     else:
#         raise ValueError(f"Unsupported key: {key}")
    
# def build_put_manhole_payload(manhole: Union[ManholeCreate], key: str) -> dict:
#     if key == "1"and isinstance(manhole, ManholeCreate):
#         return {
#             "name": manhole.name,
#             "startDate": manhole.form_date,
#             "endDate": manhole.to_date,
#             "objectType": manhole.object_type,
#             "nameObjectId": manhole.name_object_id,
#             "organizationId": manhole.organization_id,
#             "distanceToKm0": manhole.distance_0km,
#             "roadEdgeDistance": manhole.road_edge_distance,
#             "position": manhole.position,
#             "subTypeId": manhole.manhole_type_id,
#             "size": manhole.size,
#             "statusId": manhole.status_id,
#             "coordinates": manhole.coordinates,
#             "description": manhole.description,
#             "roadFaceDistanceId": manhole.name_object_id,
#             "id": manhole.id
#         }

# def payload_craw_manhole(key: str, id: int):
#     if key == "1":
#         return {
#             "id_doanDuong": id,
#             "lyTrinh": 0,
#             "id_loaiHoGa": 0,
#             "id_tinhTrang": 0,
#             "id_viTri": 0,
#             "ngay": "2025/10/01"
#         }
# {
#     "startDate": "03/07/2025",
#     "endDate": null,
#     "objectType": "ROAD",
#     "nameObjectId": 1923,
#     "organizationId": 1,
#     "distanceToKm0": "50",
#     "roadEdgeDistance": "0",
#     "position": "RIGHT",
#     "subTypeId": 379,
#     "size": "0",
#     "statusId": 432,
#     "roadFaceDistanceId":  0l
# }


# async def craw_manhole_detal_v3(id: int) -> List[dict]:
#     url = f"http://uat.bitecco.vn:8700/v1/auxiliary/manhole/detail/{id}"
#     authorization = get_key("key_v3")

#     async with aiohttp.ClientSession() as session:
#         async with session.get(url, headers={"authorization": authorization}) as response:
#             response.raise_for_status()
#             data = await response.json()
#     return{
#         "id":  data['data']['id'],
#         "name": data['data']['name'],
#         "name_object_id": data['data']['roadFaceDistance']['id'],
#         "organization_id": data['data']['organizationId'],
#         "form_date": data['data']['startDate'],
#         "to_date": data['data']['endDate'],
#         "object_type": data['data']['objectType'],
#         "object_name": f"{data['data']['objectName']}({data['data']['roadFaceDistance']['range']} - {data['data']['roadFaceDistance']['range'] + data['data']['roadFaceDistance']['longs']})",
#         "distance_0km": data['data']['distanceToKm0'],
#         "road_edge_distance": data['data']['roadEdgeDistance'],
#         "position": data['data']['position'],
#         "manhole_type_id": data['data']['subTypeId'],
#         "size": data['data']['size'],
#         "status_id": data['data']['statusId'],
#         "coordinates": data['data']['coordinates'],
#         "description": data['data']['description'],
#         "m": data
#     }

# async def craw_manhole_v1(id: int, key: str) -> List[dict]:
#     x_access_token = get_key("key_v1")
#     url = urls_v1[key]
#     headers = {
#         "x-access-permission": '{"code":"QLDB_HoGa","action":"_view"}',
#         "x-access-token": x_access_token,
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "id_doanDuong": id,
#         "lyTrinh": 0,
#         "id_loaiHoGa": 0,
#         "id_tinhTrang": 0,
#         "id_viTri": 0,
#         "ngay": "2025/10/01"
#     }

#     async with aiohttp.ClientSession() as session:
#         async with session.post(url, json=payload, headers=headers) as response:
#             response.raise_for_status()
#             data = await response.json()
#     datas = []
#     for m in data.get("data", []):
#         dt = datetime.strptime(m['ngayApDung'], "%Y-%m-%dT%H:%M:%S.%fZ")
#         t = {
#                 "id": m['id'],
#                 "process":  m['lyTrinh'],
#                 "distance_0km": m['lyTrinh_khoangCach'],
#                 "form_date": dt.strftime("%d/%m/%Y"),
#                 "position": m['tenViTri'],
#                 "manhole_type": m['tenLoaiHoGa'],
#                 "road_edge_distance": m['khoangCachMepDuong'],
#                 "size": m['kichThuoc'],
#                 "status": m['tenTinhTrang'],
#                 "to_date": m['ngayKetThuc'],
#                 "object_name": m['tenDoanDuong'],
#             }
#         datas.append(t)
#     return datas

# async def get_manhole_details(manhole_object_ids: List[str], key: str):
#     # Tạo URL để lấy danh sách ID
#     search_urls = [
#         f"{search_url_v3s[key]}{oid}"
#         for oid in manhole_object_ids
#     ]
#     id_results = await fetch_all(search_urls, fetch_ids)

#     # Gộp tất cả id thành một danh sách
#     all_ids = [mid for sublist in id_results if isinstance(sublist, list) for mid in sublist]

#     # Tạo URL chi tiết từ các id
#     detail_urls = [
#         f"{detail_url_v3s[key]}{mid}"
#         for mid in all_ids
#     ]
#     detail_results = await fetch_all(detail_urls, fetch)
#     # Lọc và định dạng kết quả
#     return [
#         {
#             "id": m['data']['id'],
#             "process": m['data']['name'],
#             "distance_0km": float(m['data']['distanceToKm0']),
#             "form_date": m['data']['startDate'],
#             "position": m['data']['positionName'],
#             "manhole_type": m['data']['subType']['name'],
#             "road_edge_distance": m['data']['roadEdgeDistance'],
#             "size": m['data']['size'],
#             "status": m['data']['statusName'],
#             "to_date": m['data']['endDate'],
#             "object_name": f"{m['data']['objectName']}({m['data']['roadFaceDistance']['range']} - {m['data']['roadFaceDistance']['range'] + m['data']['roadFaceDistance']['longs']})"
#         }
#         for m in detail_results
#         if isinstance(m, dict) and 'data' in m
#     ]

# async def post_manhole_v3(manhole: ManholeCreate, key: str) -> List[dict]:
#     try:
#         url = change_url_v3s[key]
#         authorization = get_key("key_v3")
#         payload = {
#             "startDate": manhole.form_date,
#             "endDate": manhole.to_date,
#             "objectType": manhole.object_type,
#             "nameObjectId": manhole.name_object_id,
#             "organizationId": manhole.organization_id,
#             "distanceToKm0": manhole.distance_0km,
#             "roadEdgeDistance": manhole.road_edge_distance,
#             "position": manhole.position,
#             "subTypeId": manhole.manhole_type_id,
#             "size": manhole.size,
#             "statusId": manhole.status_id,
#             "coordinates": manhole.coordinates,
#             "description": manhole.description,
#             "roadFaceDistanceId": manhole.name_object_id,
#         }
#         async with aiohttp.ClientSession() as session:
#             async with session.post(url, json=payload, headers={"authorization": authorization}) as response:
#                 response.raise_for_status()
#                 return await response.json()
            
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
 
