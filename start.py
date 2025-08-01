from main import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# pyinstaller --onefile --add-data "templates;templates" --add-data "static;static" --add-data "api_keys.json;." start.py