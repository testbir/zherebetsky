/* SearchCollection */

import React, { useState, useEffect } from "react";
import "../styles/searchcollection.css";
import search from "../assets/images/searchicon.png";

const EditCollection: React.FC = () => {
  const [watches, setWatches] = useState<any[]>([]);
  const [selectedWatch, setSelectedWatch] = useState<any | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [selectedFilters, setSelectedFilters] = useState<any>({
    brand: "",
    mechanism: "",
    gender: "",
    year: "",
    sortBy: "",
  });

  // Загрузка данных
  useEffect(() => {
    fetch("https://zherebetsky.onrender.com/watches/filter")
      .then((res) => res.json())
      .then((data) => setWatches(data))
      .catch((err) => console.error("Ошибка загрузки часов:", err));

    // Загружаем фильтры
    fetch("https://zherebetsky.onrender.com/filters")
      .then((res) => res.json())
      .then((data) => setFilters(data))
      .catch((err) => console.error("Ошибка загрузки фильтров:", err));
  }, []);

  // Применение фильтров
  const applyFilters = () => {
    let url = "https://zherebetsky.onrender.com/watches/filter?";
    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]) {
        url += `${key}=${selectedFilters[key]}&`;
      }
    });

    fetch(url)
      .then((res) => res.json())
      .then((data) => setWatches(data))
      .catch((err) => console.error("Ошибка загрузки часов:", err));

    setIsFilterModalOpen(false);
  };

  // Открыть/закрыть модальное окно с полной инфой
  const openWatchModal = (watch: any) => setSelectedWatch(watch);
  const closeWatchModal = () => setSelectedWatch(null);

  // Открыть/закрыть окно фильтров
  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  return (
    <div className="edit-collection">
      <button className="sort-button" onClick={openFilterModal}>
        Сортировать
        <img src={search} alt="Search" className="search-icon" />
      </button>

      {/* Галерея часов */}
      <div className="watch-grid">
        {watches.map((watch, index) => (
          <div key={index} className="watch-card" onClick={() => openWatchModal(watch)}>
            <img src={watch.PhotoURL} alt={watch.Brand} className="watch-image" />
            <h3>{watch.Brand}</h3>
            <p>{watch.Model || "Модель не указана"}</p>
            <p className="watch-price">{watch.Price}</p>
          </div>
        ))}
      </div>

      {/* Модальное окно с полной информацией */}
      {selectedWatch && (
        <div className="modal-overlay" onClick={closeWatchModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedWatch.PhotoURL} alt={selectedWatch.Brand} className="modal-image" />
            <h2>{selectedWatch.Brand} - {selectedWatch.Model}</h2>
            <p><strong>Тип механизма:</strong> {selectedWatch.Mechanism}</p>
            <p><strong>Пол:</strong> {selectedWatch.Gender}</p>
            <p><strong>Год выпуска:</strong> {selectedWatch.Year}</p>
            <p><strong>Цена:</strong> {selectedWatch.Price}</p>
            <p><strong>Комментарий:</strong> {selectedWatch.Comment || "Нет комментариев"}</p>
            <button onClick={closeWatchModal}>Закрыть</button>
          </div>
        </div>
      )}

      {/* Модальное окно фильтрации */}
      {isFilterModalOpen && (
        <div className="modal-overlay" onClick={closeFilterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Фильтр</h3>

            <label>Бренд</label>
            <select onChange={(e) => setSelectedFilters({ ...selectedFilters, brand: e.target.value })}>
              <option value="">Все</option>
              {filters.brands?.map((brand: string) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <label>Тип механизма</label>
            <select onChange={(e) => setSelectedFilters({ ...selectedFilters, mechanism: e.target.value })}>
              <option value="">Все</option>
              {filters.mechanisms?.map((mechanism: string) => (
                <option key={mechanism} value={mechanism}>{mechanism}</option>
              ))}
            </select>

            <label>Пол</label>
            <select onChange={(e) => setSelectedFilters({ ...selectedFilters, gender: e.target.value })}>
              <option value="">Все</option>
              {filters.genders?.map((gender: string) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

            <label>Год</label>
            <select onChange={(e) => setSelectedFilters({ ...selectedFilters, year: e.target.value })}>
              <option value="">Все</option>
              {filters.years?.map((year: string) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <label>Сортировать по</label>
            <select onChange={(e) => setSelectedFilters({ ...selectedFilters, sortBy: e.target.value })}>
              <option value="">Без сортировки</option>
              <option value="price">Цена</option>
              <option value="year">Год выпуска</option>
            </select>

            <button onClick={applyFilters}>Применить</button>
            <button onClick={closeFilterModal}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCollection;
