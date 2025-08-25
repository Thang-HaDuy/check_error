import aiohttp
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from src.schema.user import LoginSchema
from src.schema.craw import CrawDistance
from src.service.key import get_key, update_key
import requests
import urllib.parse

import requests


def craw_distance_v1():
    x_access_token = get_key("key_v1")
    url = "https://rbms-hn-api.giaothong247.vn/duongbo/doanduong/getbyname"
    
    headers = {
        "x-access-permission": '{"code":"QLDB_CongTrinhDuongBo","action":"_view"}',
        "x-access-token": x_access_token
    }

    payload = {
        "name": ""
    }

    response = requests.post(url,headers=headers, json=payload)
    json_data = response.json()

    print(json_data)
    return [
            {
                "id": c['id'],
                "name": c['name']
            } for c in json_data["data"]
        ]


async def craw_distance_v3(name):
    authorization = get_key("key_v3")
    url = "http://uat.bitecco.vn:8700/v1/road-face-distance/list?page=0&size=25"
    
    if name and name.strip().replace('"', '') != '':
        url += f"&name={name}&keySearch={name}"

    headers = {
        "authorization": authorization,
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            response.raise_for_status()
            json_data = await response.json()

            return [
                {
                    "id": c['id'],
                    "name": c['name'],
                    "object_name": f"{c['name']}{c['range']} - {c['range']+c['longs']}"
                } for c in json_data["data"]["content"]
            ]

async def login_v3(login: LoginSchema):
    url = "http://uat.bitecco.vn:8700/api/auth/login"
    
    payload = {
        "username": login.username,
        "password": login.password,
        "rememberMe": False
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                response.raise_for_status()
                json_data = await response.json()
        update_key("key_v3", f"Bearer {json_data['data']['access_token']}")
        return json_data['data']['access_token']
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def login_v1(login: LoginSchema):
    url = "https://rbms-hn-api.giaothong247.vn/auth/token"
    
    payload = {
        "username": login.username,
        "password": login.password,
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                response.raise_for_status()
                json_data = await response.json()
        update_key("key_v1", json_data['token'])
        return json_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# def craw_distance_v1():
#     x_access_token = get_key("key_v1")
#     url = "https://rbms-hn-api.giaothong247.vn/duongbo/doanduong/getbyname?name="
    
#     headers = {
#         "x-access-permission": '{"code":"QLDB_CongTrinhDuongBo","action":"_view"}',
#         "x-access-token": x_access_token
#     }

#     response = requests.post(url, headers=headers)
    
#     print("Status:", response.status_code)
#     print("Response JSON:", response.json())

# async def craw_distance_v1():
#     x_access_token = get_key("key_v1")
#     url = "https://rbms-hn-api.giaothong247.vn/duongbo/doanduong/getbyname"
    
#     headers = {
#         "x-access-permission": '{"code":"QLDB_CongTrinhDuongBo","action":"_view"}',
#         "x-access-token": x_access_token
#     }

#     payload = {
#         "name": ""
#     }
    
#     async with aiohttp.ClientSession() as session:
#         async with session.post(url, json=payload, headers=headers) as response:
#             response.raise_for_status()
#             json_data = await response.json()

#             return [
#                 CrawDistance(
#                     id=c['id'],
#                     name=c['name']
#                 ) for c in json_data["data"]
#             ]
