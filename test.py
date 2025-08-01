import asyncio
import aiohttp
from typing import List

from src.service.key import get_key

# Giới hạn số request đồng thời
semaphore = asyncio.Semaphore(50)

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
            # async with session.get(url) as response:
                response.raise_for_status()
                data = await response.json()
                print(data)
                return [item['id'] for item in data['data']['content']]
        except Exception as e:
            return {"error": str(e), "url": url}

async def fetch_all(urls: List[str], handler):
    connector = aiohttp.TCPConnector(limit=100)
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        tasks = [handler(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

async def get_manhole_details(manhole_object_ids: List[str]):
    # Tạo URL để lấy danh sách ID
    search_urls = [
        f"http://uat.bitecco.vn:8700/v1/auxiliary/manhole/search?page=0&size=500&date=&objectType=ROAD&objectIds={oid}"
        for oid in manhole_object_ids
    ]
    id_results = await fetch_all(search_urls, fetch_ids)

    # Gộp tất cả id thành một danh sách
    all_ids = [mid for sublist in id_results if isinstance(sublist, list) for mid in sublist]

    # Tạo URL chi tiết từ các id
    detail_urls = [
        f"http://uat.bitecco.vn:8700/v1/auxiliary/manhole/detail/{mid}"
        for mid in all_ids
    ]
    detail_results = await fetch_all(detail_urls, fetch)

    # Lọc và định dạng kết quả
    return [
        {
            "id": m['data']['id'],
            "process": m['data']['name'],
            "distance_0km": int(m['data']['distanceToKm0']),
            "form_date": m['data']['startDate'],
            "position": m['data']['positionName'],
            "manhole_type": m['data']['subType']['name'],
            "road_edge_distance": m['data']['roadEdgeDistance'],
            "size": m['data']['size'],
            "status": m['data']['statusName'],
            "to_date": m['data']['endDate'],
            "object_name": m['data']['objectName']
        }
        for m in detail_results
        if isinstance(m, dict) and 'data' in m
    ]

if __name__ == "__main__":
    import asyncio
    result = asyncio.run(get_manhole_details(["1923", "3201", "3199"]))
    print(result)
