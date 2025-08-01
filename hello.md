#

## Kè

```python
api_v3 = "http://uat.bitecco.vn:8700/v1/auxiliary/embankment/search?page=0&size=25&date=&objectType=ROAD&objectIds=2900&_t=1754012534525"

API_V3_UPDATE = "PUT http://uat.bitecco.vn:8700/v1/auxiliary/embankment"
{
    "name": "Kè - Km8+220-:-Km8+260 - Kè đá hộc",
    "startDate": "01/01/2024",
    "endDate": null,
    "objectType": "ROAD",
    "nameObjectId": 2900,
    "organizationId": 29,
    "distanceToKm0": 8220,
    "roadEdgeDistance": -1.5,
    "position": "RIGHT",
    "subTypeId": 172,
    "length": 40,
    "width": null,
    "height": null,
    "statusId": 317,
    "coordinates": null,
    "description": null,
    "roadFaceDistanceId": 2900,
    "id": 1571
}
API_V3_CREATE = "POST http://uat.bitecco.vn:8700/v1/auxiliary/embankment"
{
    "startDate": "07/08/2025",
    "endDate": null,
    "objectType": "ROAD",
    "nameObjectId": 2901,
    "organizationId": 1,
    "distanceToKm0": "50",
    "roadEdgeDistance": "4",
    "position": "LEFT",
    "subTypeId": 326,
    "length": "4",
    "width": "4",
    "height": "4",
    "statusId": 436,
    "roadFaceDistanceId": 2901
}

api_v1 = "https://rbms-hn-api.giaothong247.vn/duongbo/ke/getbydoanduong"
{
    "id_doanDuong": 892,
    "lyTrinh": 0,
    "id_viTri": 0,
    "id_tinhTrang": 0,
    "id_loaiKe": 0,
    "ngay": "2025/10/01"
}
```

-   ngày bắt đầu
-   ngày kết thúc
-   loại đối tượng: đường
-   tên đối tượng
-   khoảng các km0
-   khoảng cách mép đường
-   vị trí {
    Phải: RIGHT,
    Trái: LEFT
    }
-   loại kè {
    Bê tông cốt thép: 171
    Kè đá hộc: 172
    Bê tông xi măng: 323
    Gạch xây: 324
    Đá xây: 325
    Ốp mái đá hộc: 326
    }
-   chiều dài
-   chiều rộng
-   chiều sâu
-   tình trạng {
    Tốt: 436,
    Bình thường: 435
    }

```json
// API v3
{
    "code": 200,
    "msg": "OK",
    "data": {
        "id": 1572,
        "name": "Kè - Km4+050 - Kè đá hộc",
        "startDate": "01/01/2024",
        "endDate": null,
        "objectType": "ROAD",
        "roadFaceDistance": {
            "id": 2668,
            "name": "ĐH10-TT (Km0+000 - Km6+420)",
            "distanceId": 1581,
            "startDate": "01/04/2022",
            "range": 6420,
            "longs": 6420,
            "coordinates": null,
            "itinerary": "Km0+000",
            "startPoint": null,
            "endPoint": null,
            "faceWidth": 11,
            "roadbedWidth": null,
            "laneNumber": 1,
            "technicalLevelId": null,
            "planningLevelId": null,
            "cost": 0,
            "statusReviewId": null,
            "note": null,
            "layer1": null,
            "layer2": null,
            "layer3": null,
            "layer4": null,
            "layer5": null,
            "layer6": null,
            "designSpeed": null,
            "maxOperatingSpeed": null,
            "minOperatingSpeed": null
        },
        "bigBridge": null,
        "otherBridge": null,
        "roadTunnel": null,
        "levelCrossing": null,
        "organizationId": 30,
        "distanceToKm0": 4050,
        "roadEdgeDistance": -1,
        "position": "RIGHT",
        "coordinates": null,
        "directionType": null,
        "length": 170,
        "width": null,
        "height": null,
        "status": {
            "id": 317,
            "groupId": 129,
            "code": "317",
            "name": "Không hoạt động"
        },
        "subType": {
            "id": 172,
            "groupId": 31,
            "code": "172",
            "name": "Kè đá hộc"
        },
        "statusName": "Không hoạt động",
        "cost": null,
        "description": null,
        "objectName": "ĐH10-TT (Km0+000 - Km6+420)",
        "positionName": "Phải",
        "subTypeId": 172,
        "objectTypeName": "Đường",
        "statusId": 317
    }
}
// API V1
{
    "data": [
        {
            "id": 395,
            "id_doanDuong": 892,
            "tenDoanDuong": "Tản Lĩnh -Yên Bài",
            "lyTrinh": "Km8+220-:-Km8+260",
            "lyTrinh_khoangCach": 8220,
            "khoangCachMepDuong": -1.5,
            "chieuDai": 40,
            "id_viTri": 2,
            "tenViTri": "Phải",
            "ghiChu": null,
            "id_ke_log": 396,
            "id_loaiKe": 5,
            "tenLoaiKe": "Kè đá hộc",
            "noiDung": null,
            "id_tinhTrang": 33,
            "tenTinhTrang": "Bình thường",
            "id_donViQuanLy": 29,
            "tenDonViQuanLy": "Đội QLGT số 2",
            "id_tuyenDuong": 839,
            "namApDung": 2024,
            "quyApDung": 1,
            "namKetThuc": null,
            "quyKetThuc": null,
            "ngayApDung": "2024-01-01T00:00:00.000Z",
            "ngayKetThuc": null,
            "is_suaChua": {
                "type": "Buffer",
                "data": [
                    0
                ]
            },
            "ngayApDung_quaTrinh": null
        }
    ],
    "message": "successfully!"
}
```

# Cột km

```python
api_v3 = "http://uat.bitecco.vn:8700/v1/auxiliary/km-column/search?page=0&size=25&date=&objectType=ROAD&objectIds=2900"

API_V3_UPDATE = "PUT http://uat.bitecco.vn:8700/v1/auxiliary/embankment"
{
    "name": "Cột KM - Km10 - BTCT",
    "startDate": "15/01/2024",
    "endDate": null,
    "objectType": "ROAD",
    "nameObjectId": 2900,
    "organizationId": 29,
    "distanceToKm0": 10000,
    "roadEdgeDistance": -1,
    "position": "RIGHT",
    "subTypeId": 1,
    "content": "Cột KM - Km10",
    "statusId": 317,
    "coordinates": null,
    "description": "Cột KM",
    "roadFaceDistanceId": 2900,
    "id": 50827
}
API_V3_CREATE = "POST http://uat.bitecco.vn:8700/v1/auxiliary/embankment"
{
    "startDate": "07/08/2025",
    "endDate": null,
    "objectType": "ROAD",
    "nameObjectId": 2901,
    "organizationId": 1,
    "distanceToKm0": "10",
    "roadEdgeDistance": "0",
    "position": "LEFT",
    "subTypeId": 150,
    "statusId": 416,
    "roadFaceDistanceId": 2901
}

api_v1 = "https://rbms-hn-api.giaothong247.vn/duongbo/cot-km/getbydoanduong"
{
    "id_doanDuong": 892,
    "lyTrinh": 0,
    "id_loaiCotKm": 0,
    "id_tinhTrang": 0,
    "id_viTri": 0,
    "ngay": "2025/10/01"
}
```

```json
// API v3
{
    "code": 200,
    "msg": "OK",
    "data": {
        "id": 1571,
        "name": "Kè - Km8+220-:-Km8+260 - Kè đá hộc",
        "applyDate": "01/01/2024",
        "startDate": "01/01/2024",
        "endDate": null,
        "objectType": "ROAD",
        "roadFaceDistance": {
            "id": 2900,
            "name": "Tản Lĩnh -Yên Bài (Km0+00 - Km10+350)",
            "distanceId": 404,
            "startDate": "01/07/2023",
            "range": 0,
            "longs": 2350,
            "coordinates": null,
            "itinerary": "Km0+000",
            "startPoint": null,
            "endPoint": null,
            "faceWidth": 7,
            "roadbedWidth": null,
            "laneNumber": 2,
            "technicalLevelId": null,
            "planningLevelId": null,
            "cost": 0,
            "statusReviewId": null,
            "note": null,
            "layer1": null,
            "layer2": null,
            "layer3": null,
            "layer4": null,
            "layer5": null,
            "layer6": null,
            "designSpeed": null,
            "maxOperatingSpeed": null,
            "minOperatingSpeed": null
        },
        "bigBridge": null,
        "otherBridge": null,
        "roadTunnel": null,
        "levelCrossing": null,
        "organizationId": 29,
        "distanceToKm0": 8220,
        "roadEdgeDistance": -1.5,
        "position": "RIGHT",
        "coordinates": null,
        "directionType": null,
        "length": 40,
        "width": null,
        "height": null,
        "status": {
            "id": 317,
            "groupId": 129,
            "code": "317",
            "name": "Không hoạt động"
        },
        "subType": {
            "id": 172,
            "groupId": 31,
            "code": "172",
            "name": "Kè đá hộc"
        },
        "statusName": "Không hoạt động",
        "cost": null,
        "description": null,
        "objectName": "Tản Lĩnh -Yên Bài (Km0+00 - Km10+350)",
        "positionName": "Phải",
        "subTypeId": 172,
        "objectTypeName": "Đường",
        "statusId": 317
    }
}
// API v1
{
    "data": [
        {
            "id": 1300,
            "id_doanDuong": 892,
            "tenDoanDuong": "Tản Lĩnh -Yên Bài",
            "id_tuyenDuong": 839,
            "lyTrinh": "Km3",
            "lyTrinh_khoangCach": 3000,
            "id_viTri": 2,
            "tenViTri": "Phải",
            "khoangCachMepDuong": -1,
            "ghiChu": null,
            "id_cot_km_log": 1300,
            "noiDung": null,
            "id_tinhTrang": 3,
            "tenTinhTrang": "Bình thường",
            "id_donViQuanLy": 29,
            "tenDonViQuanLy": "Đội QLGT số 2",
            "id_loaiCot": 1,
            "tenLoaiCot": "Cột BT",
            "namApDung": 2024,
            "quyApDung": 1,
            "namKetThuc": null,
            "quyKetThuc": null,
            "ngayApDung": "2024-01-15T00:00:00.000Z",
            "ngayKetThuc": null,
            "ngayApDung_quaTrinh": "2024-01-15T00:00:00.000Z",
            "is_suaChua": {
                "type": "Buffer",
                "data": [
                    0
                ]
            }
        },
    ],
    "message": "successfully!"
}
```
