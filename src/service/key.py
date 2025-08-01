import json
import os
from pathlib import Path

from config import BASE_DIR

# Đường dẫn tới file JSON
KEY_FILE = Path(os.path.join(BASE_DIR, "api_keys.json"))
def load_keys():
    if not KEY_FILE.exists():
        return {}
    with open(KEY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_keys(data: dict):
    with open(KEY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def get_key(service: str):
    data = load_keys()
    return data.get(service)

def update_key(service: str, new_key: str):
    data = load_keys()
    data[service] = new_key
    save_keys(data)
