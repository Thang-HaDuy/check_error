from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from config import resource_path
from src.schema.user import LoginSchema
from src.service.craw import login_v1, login_v3
from src.api import craw, manhole, category
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

@asynccontextmanager
async def lifespan(app: FastAPI):
    await category.GetCategory()
    yield
    print("🧹 Đóng server FastAPI...")
    # Ví dụ: đóng kết nối, cleanup...

app = FastAPI(lifespan=lifespan)
static_dir = resource_path("static")
templates_dir = resource_path("templates")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory=templates_dir)

app.include_router(craw.router, prefix="/craw", tags=["Craw"])
app.include_router(manhole.router, prefix="/manhole", tags=["Manhole"])
app.include_router(category.router, prefix="/category", tags=["Category"])

@app.get("/home", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/")
async def login(login: LoginSchema):
    return await login_v3(login)

@app.post("/loginv1")
async def login(login: LoginSchema):
    return await login_v1(login)

