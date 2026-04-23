import os
import traceback

full_path = r"C:\Windows\blob:http://localhost:5173/bf-something"
print("Testing os.path.exists...")
try:
    os.path.exists(full_path)
    print("os.path.exists SUCCESS")
except OSError as e:
    print(f"CAUGHT OSERROR: {e}")
except Exception as e:
    print(f"CAUGHT EXCEPTION: {e}")

print("Testing open...")
try:
    with open(full_path, "rb") as f:
        pass
    print("open SUCCESS")
except OSError as e:
    print(f"CAUGHT OSERROR: {e}")
except Exception as e:
    print(f"CAUGHT EXCEPTION: {e}")
