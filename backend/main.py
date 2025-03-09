#main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.api.routes import router


app = FastAPI(title="Watch Collection API")


# Разрешённые домены (замени на свои)
origins = [
    "https://lovingly-valuable-rhino.cloudpub.ru",  # Фронтенд
    "http://localhost:5173",  # Локальная разработка
    "*"  # Разрешить всё (на время тестов)
]

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешённые домены
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
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
