import os
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from config import resource_path
from src.schema.user import LoginSchema
from src.service.craw import login_v3
from src.api import craw, manhole
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
static_dir = resource_path("static")
templates_dir = resource_path("templates")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory=templates_dir)

app.include_router(craw.router, prefix="/craw", tags=["Craw"])
app.include_router(manhole.router, prefix="/manhole", tags=["Manhole"])

@app.get("/home", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/")
async def login(login: LoginSchema):
    return await login_v3(login)

