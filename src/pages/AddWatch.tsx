/* AddWatch */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addWatch.css"; // Подключаем стили

const AddWatch: React.FC = () => {
  const navigate = useNavigate();

  // Генерация списка годов (от текущего до 1900)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  // Состояния для формы
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    mechanism: "Кварцевые",
    gender: "Мужские",
    year: currentYear.toString(), // ✅ По умолчанию текущий год
    price: "",
    comment: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  // Функция для обновления данных формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Функция для загрузки фото
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  // Отправка данных на сервер
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (photo) {
      formDataToSend.append("photo", photo);
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/watches", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Часы успешно добавлены!");
        navigate("/");
      } else {
        alert("Ошибка при добавлении часов.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при отправке данных.");
    }
  };

  return (
    <div className="add-watch-container">
      <form onSubmit={handleSubmit} className="add-watch-form">
        <div className="form-columns">
          {/* Левый столбец */}
          <div className="form-left">
            <label className="file-label">
              Загрузить фото</label>
              <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />
  

            <label>Бренд: <input type="text" name="brand" value={formData.brand} onChange={handleChange} required /></label>
            <label>Модель: <input type="text" name="model" value={formData.model} onChange={handleChange} required /></label>
            <label>Тип механизма: 
              <select name="mechanism" value={formData.mechanism} onChange={handleChange} required>
                <option value="Кварцевые">Кварцевые</option>
                <option value="Механические">Механические</option>
              </select>
            </label>
            <label>Пол: 
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Мужские">Мужские</option>
                <option value="Женские">Женские</option>
              </select>
            </label>
            <label>Год выпуска: 
              <select name="year" value={formData.year} onChange={handleChange} required>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
            <label>Цена: <input type="number" name="price" value={formData.price} onChange={handleChange} required /></label>
          </div>

          {/* Правый столбец */}
          <div className="form-right">
            <label>Комментарий
              <textarea name="comment" value={formData.comment} onChange={handleChange} />
            </label>
          </div>
        </div>

        {/* Кнопка отправки */}
        <button type="submit" className="submit-button">Отправить</button>
      </form>
    </div>
  );
};

export default AddWatch;
