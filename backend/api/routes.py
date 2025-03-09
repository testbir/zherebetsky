# routes.py

from fastapi import APIRouter, UploadFile, File, Form
from enum import Enum  # ✅ Добавили импорт
import pandas as pd
import os
from typing import Optional

router = APIRouter()

CSV_FILE = "data/collection.csv"
UPLOAD_FOLDER = "data/photos/"

# Убеждаемся, что папка для фото существует
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Читаем CSV-файл
def read_csv():
    if os.path.exists(CSV_FILE) and os.path.getsize(CSV_FILE) > 0:
        return pd.read_csv(CSV_FILE)
    else:
        return pd.DataFrame(columns=["ID", "Brand", "Model", "Mechanism", "Gender", "Year", "Price", "Comment", "Photo"])

# Сохраняем данные в CSV
def save_to_csv(data):
    df = read_csv()
    df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)
    df.to_csv(CSV_FILE, index=False)


class Mechanism(str, Enum):
    quartz = "Кварцевые"
    mechanical = "Механические"

class Gender(str, Enum):
    male = "Мужские"
    female = "Женские"
    

# Добавление часов (POST)
@router.post("/watches")
async def add_watch(
    brand: str = Form(...),
    model: str = Form(...),
    mechanism: Mechanism = Form(...), # Можно выбрать механизм
    gender: Gender = Form(...), # Можно выбрать гендер
    year: int = Form(...),
    price: float = Form(...),
    comment: Optional[str] = Form(""),
    photo: UploadFile = File(...)
):
    # Генерируем путь для фото
    photo_path = os.path.join(UPLOAD_FOLDER, photo.filename)

    # Сохраняем фото
    with open(photo_path, "wb") as buffer:
        buffer.write(await photo.read())

    # Создаем запись для CSV
    df = read_csv()
    new_watch = {
    "ID": len(df) + 1,
    "Brand": brand,
    "Model": model,
    "Mechanism": mechanism.value,
    "Gender": gender.value,
    "Year": f"{year}г",
    "Price": f"{int(price) if price.is_integer() else price}₽",  # ✅ Убираем .0 если целое
    "Comment": comment,
    "Photo": photo_path
}

    # ✅ Сохраняем в CSV
    save_to_csv(new_watch)

    return {"message": "Watch added successfully!", "watch": new_watch}

# ✅ Эндпоинт для получения фильтров
@router.get("/filters")
def get_filters():
    df = read_csv()
    
    if df.empty:
        return {"message": "Нет данных в коллекции"}

    # Получаем уникальные значения по категориям
    filters = {
        "brands": sorted(df["Brand"].dropna().unique().tolist()),  # Уникальные бренды
        "mechanisms": sorted(df["Mechanism"].dropna().unique().tolist()),  # Кварц, Механика
        "genders": sorted(df["Gender"].dropna().unique().tolist()),  # Мужские, Женские
        "years": sorted(df["Year"].dropna().unique().tolist()),  # Все года
    }
    
    return filters

# ✅ Фильтрация часов по параметрам
# ✅ Фильтрация и сортировка
@router.get("/watches/filter")
def filter_watches(
    brand: Optional[str] = None,
    mechanism: Optional[str] = None,
    gender: Optional[str] = None,
    year: Optional[int] = None,
    sortBy: Optional[str] = None
):
    df = read_csv()

    if df.empty:
        return {"message": "Нет данных в коллекции"}

    if brand:
        df = df[df["Brand"] == brand]
    if mechanism:
        df = df[df["Mechanism"] == mechanism]
    if gender:
        df = df[df["Gender"] == gender]
    if year:
        df = df[df["Year"] == year]

    if sortBy == "price":
        df = df.sort_values(by="Price", ascending=True)
    if sortBy == "year":
        df = df.sort_values(by="Year", ascending=False)

    watches = df.fillna("").to_dict(orient="records")

    for watch in watches:
        watch["PhotoURL"] = f"http://127.0.0.1:8001/photos/{os.path.basename(watch['Photo'])}"

    return watches
