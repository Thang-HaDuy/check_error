import os
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import uvicorn
from config import BASE_DIR
from src.schema.user import LoginSchema
from src.service.craw import login_v3
from src.api import craw, manhole
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "static")),
    name="static"
)
# Set up Jinja2 templates
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

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
    print(login)
    return await login_v3(login)

