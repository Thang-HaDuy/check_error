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