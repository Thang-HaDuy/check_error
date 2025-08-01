from pydantic import BaseModel


class CrawDistance(BaseModel):
    id: int
    name: str   