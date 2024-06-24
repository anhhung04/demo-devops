import os

for file in os.listdir('./'):
    if not file.startswith("_"):
        module_name, _ = os.path.splitext(file)
        module = __import__(f"schemas.{module_name}", fromlist=[module_name])
        globals()[module_name] = module