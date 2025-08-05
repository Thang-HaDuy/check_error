import os
import sys


def resource_path(relative_path):
    """Trả về đường dẫn tuyệt đối đến file resource.
       Dùng được cả khi chạy từ source (.py) lẫn file .exe đóng gói bằng PyInstaller.
    """
    if hasattr(sys, '_MEIPASS'):
        # Khi chạy file .exe của PyInstaller
        base_path = sys._MEIPASS
    else:
        # Khi chạy script .py
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)
