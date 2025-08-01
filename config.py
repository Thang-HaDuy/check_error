import os
import sys


def get_base_dir():
    if getattr(sys, 'frozen', False):
        # Đang chạy từ file .exe đã build
        return os.path.dirname(sys.executable)
    else:
        # Đang chạy từ mã nguồn Python
        return os.path.dirname(os.path.abspath(__file__))

BASE_DIR = get_base_dir()