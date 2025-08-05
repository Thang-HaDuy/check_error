from typing import Optional
from pydantic import BaseModel

class Manhole(BaseModel):
    id: int
    name: str
    name_object_id: int
    organization_id: int
    form_date: str
    to_date: str  | None = None
    object_type: str
    object_name: str
    distance_0km: float
    road_edge_distance: float
    position: str
    manhole_type_id: int
    size: str
    status_id: int | None = None
    coordinates: str  | None = None
    description: str  | None = ""
 
class ManholeCreate(BaseModel):
    name_object_id: int
    organization_id: int
    form_date: str
    to_date: str  | None = None
    object_type: str
    distance_0km: float
    road_edge_distance: float
    position: str
    manhole_type_id: int
    size: str
    status_id: int | None = None
    coordinates: str  | None = None
    description: str  | None = ""

# class Manhole(BaseModel):
#     id: int
#     name: str
#     name_object_id: int
#     organization_id: int
#     form_date: str
#     to_date: str  | None = None
#     object_type: str
#     object_name: str
#     distance_0km: float
#     road_edge_distance: float
#     position: str
#     manhole_type_id: int
#     size: str
#     status_id: int | None = None
#     coordinates: str  | None = None
#     description: str  | None = ""




class ExitRamp(BaseModel):
    id: int
    name: str
    startDate: str
    endDate: Optional[str] = None
    objectType: str
    nameObjectId: int
    organizationId: int
    distanceToKm0: float
    roadEdgeDistance: float
    position: str
    width: float
    angle: float
    roadStructureId: int
    trafficOrganization: str
    statusId: int
    coordinates: Optional[str] = None  # Nếu là toạ độ [lon, lat]
    description: Optional[str] = None
    roadFaceDistanceId: int

class BodyData11(BaseModel):
    coordinates: Optional[str] = None  # Nếu là toạ độ [lon, lat]
    description: Optional[str] = None
    distance_0km: float
    to_date: Optional[str] = None
    id: int
    length: float
    name: str
    name_object_id: int
    object_type: str
    organization_id: int
    position: str
    quanlity: float
    reflective_eyes_number: float
    road_edge_distance: float
    form_date: str
    status_id: int
    type: int