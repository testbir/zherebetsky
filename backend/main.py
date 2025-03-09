#main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import router

app = FastAPI(title="Watch Collection API")

# ✅ Правильная настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешает запросы со всех источников (ПОКА ВСЕ РАЗРЕШАЕМ)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все HTTP методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Разрешаем все заголовки
)

# ✅ Подключаем маршруты
app.include_router(router)

# ✅ Раздаём фото (ОБЯЗАТЕЛЬНО УБЕДИСЬ, ЧТО ПАПКА data/photos СУЩЕСТВУЕТ)
app.mount("/photos", StaticFiles(directory="data/photos"), name="photos")

@app.get("/")
def home():
    return {"message": "Watch Collection API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
