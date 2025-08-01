from datetime import datetime
from typing import Dict, List, Union

data_handlers = {
    "1": {
        "urls": { 
            "v1": "https://rbms-hn-api.giaothong247.vn/duongbo/hoga/getByDoanDuong",
            "change": "http://uat.bitecco.vn:8700/v1/auxiliary/manhole",
            "search": "http://uat.bitecco.vn:8700/v1/auxiliary/manhole/search?page=0&size=500&date=&objectType=ROAD&objectIds=",
            "detail": "http://uat.bitecco.vn:8700/v1/auxiliary/manhole/detail/"
        },
        "parse_detail": lambda d: {
            "id":  d['data']['id'],
            "name": d['data']['name'],
            "name_object_id": d['data']['roadFaceDistance']['id'],
            "organization_id": d['data']['organizationId'],
            "form_date": d['data']['startDate'],
            "to_date": d['data']['endDate'],
            "object_type": d['data']['objectType'],
            "object_name": f"{d['data']['objectName']}({d['data']['roadFaceDistance']['range']} - {d['data']['roadFaceDistance']['range'] + d['data']['roadFaceDistance']['longs']})",
            "distance_0km": d['data']['distanceToKm0'],
            "road_edge_distance": d['data']['roadEdgeDistance'],
            "position": d['data']['position'],
            "manhole_type_id": d['data']['subTypeId'],
            "size": d['data']['size'],
            "status_id": d['data']['statusId'],
            "coordinates": d['data']['coordinates'],
            "description": d['data']['description'],
        },

        "parse_list": lambda d: [
            {
                "id": m['id'],
                "process":  m['lyTrinh'],
                "distance_0km": m['lyTrinh_khoangCach'],
                "form_date": datetime.strptime(m['ngayApDung'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%d/%m/%Y"),
                "position": m['tenViTri'],
                "manhole_type": m['tenLoaiHoGa'],
                "road_edge_distance": m['khoangCachMepDuong'],
                "size": m['kichThuoc'],
                "status": m['tenTinhTrang'],
                "to_date": m['ngayKetThuc'],
                "object_name": m['tenDoanDuong'],
            }
            for m in d.get("data", [])
        ],

        "format_detail": lambda d: {
            "id": d['data']['id'],
            "process": d['data']['name'],
            "distance_0km": float(d['data']['distanceToKm0']),
            "form_date": d['data']['startDate'],
            "position": d['data']['positionName'],
            "manhole_type": d['data']['subType']['name'],
            "road_edge_distance": d['data']['roadEdgeDistance'],
            "size": d['data']['size'],
            "status": d['data']['statusName'],
            "to_date": d['data']['endDate'],
            "object_name": f"{d['data']['objectName']}({d['data']['roadFaceDistance']['range']} - {d['data']['roadFaceDistance']['range'] + d['data']['roadFaceDistance']['longs']})"
        },

        "build_post_payload": lambda m: {
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
        },

        "build_put_payload": lambda m: {
            "id": m.id,
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
        },

        "craw_payload": lambda id_: {
            "id_doanDuong": id_,
            "lyTrinh": 0,
            "id_loaiHoGa": 0,
            "id_tinhTrang": 0,
            "id_viTri": 0,
            "ngay": "2025/10/01"
        }
    },
    "2": {
        "urls": { 
            "v1": "https://rbms-hn-api.giaothong247.vn/duongbo/ke/getbydoanduong",
            "change": "http://uat.bitecco.vn:8700/v1/auxiliary/embankment",
            "search": "http://uat.bitecco.vn:8700/v1/auxiliary/embankment/search?page=0&size=500&date=&objectType=ROAD&objectIds=",
            "detail": "http://uat.bitecco.vn:8700/v1/auxiliary/embankment/detail/"
        },
        "craw_payload": lambda id_: {
            "id_doanDuong": 892,
            "lyTrinh": 0,
            "id_viTri": 0,
            "id_tinhTrang": 0,
            "id_loaiKe": 0,
            "ngay": "2025/10/01"
        },
        "parse_list": lambda d: [
            {
                "id": m['id'],
                "process":  m['lyTrinh'],
                "object_name": m['tenDoanDuong'],
                "distance_0km": m['lyTrinh_khoangCach'],
                "form_date": datetime.strptime(m['ngayApDung'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%d/%m/%Y"),
                "to_date": m['ngayKetThuc'],
                "road_edge_distance": m['khoangCachMepDuong'],
                "position": m['tenViTri'],
                "type": m['tenLoaiKe'],
                "status": m['tenTinhTrang'],
                "size": m['chieuDai'],
            }
            for m in d.get("data", [])
        ],
        "format_detail": lambda d: {
            "id": d['data']['id'],
            "process": d['data']['name'],
            "object_name": f"{d['data']['objectName']}({d['data']['roadFaceDistance']['range']} - {d['data']['roadFaceDistance']['range'] + d['data']['roadFaceDistance']['longs']})",
            "distance_0km": float(d['data']['distanceToKm0']),
            "form_date": d['data']['startDate'],
            "to_date": d['data']['endDate'],
            "road_edge_distance": d['data']['roadEdgeDistance'],
            "position": d['data']['positionName'],
            "type": d['data']['subType']['name'],
            "status": d['data']['statusName'],
            "size": d['data']['length'],
        },
        "parse_detail": lambda d: {
            "id":  d['data']['id'],
            "name": d['data']['name'],
            "form_date": d['data']['startDate'],
            "to_date": d['data']['endDate'],
            "name_object_id": d['data']['roadFaceDistance']['id'],
            "object_name": f"{d['data']['objectName']}({d['data']['roadFaceDistance']['range']} - {d['data']['roadFaceDistance']['range'] + d['data']['roadFaceDistance']['longs']})",
            "organization_id": d['data']['organizationId'],
            "object_type": d['data']['objectType'],
            "distance_0km": d['data']['distanceToKm0'],
            "road_edge_distance": d['data']['roadEdgeDistance'],
            "position": d['data']['position'],
            "manhole_type_id": d['data']['subTypeId'],
            "size": d['data']['length'],
            "status_id": d['data']['statusId'],
            "coordinates": d['data']['coordinates'],
            "description": d['data']['description'],
        },
        "build_post_payload": lambda m: {
            "distanceToKm0": m.distance_0km,
            "endDate": m.to_date,
            "length": m.size,
            "nameObjectId": m.name_object_id,
            "objectType": m.object_type,
            "organizationId": m.organization_id,
            "position": m.position,
            "roadEdgeDistance": m.road_edge_distance,
            "roadFaceDistanceId": m.name_object_id,
            "startDate": m.form_date,
            "statusId": m.status_id,
            "subTypeId": m.manhole_type_id,
            "coordinates": m.coordinates,
            "description": m.description,
        },

        "build_put_payload": lambda m: {
            "coordinates": m.coordinates,
            "description": m.description,
            "distanceToKm0": m.distance_0km,
            "endDate": m.to_date,
            "height": None,
            "id": m.id,
            "length": m.size,
            "name": m.name,
            "nameObjectId": m.name_object_id,
            "objectType": m.object_type,
            "organizationId": m.organization_id,
            "position": m.position,
            "roadEdgeDistance": m.road_edge_distance,
            "roadFaceDistanceId": m.name_object_id,
            "startDate": m.form_date,
            "statusId": m.status_id,
            "subTypeId": m.manhole_type_id,
            "width": None
        },
    },

    # Có thể thêm key khác như "2": { ... }, "3": { ... } nếu cần
}