/* Home.tsx */


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"
import logo from "../assets/images/LogoZherebetsky.png"

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAddCatalog = () => {
      navigate("/add-watch");
  };
  const handleSearchCollection = () => {
     navigate("/search-collection");
  };




  return (
    <div className="home">
      <div className="home-container">
          <img src={logo} alt="Zherebetsky Logo" className="logo-zherebetsky" />
          <button className="collection-button" onClick={handleAddCatalog}>Добавить часы в коллекцию</button>
          <button className="edit-collection-button" onClick={handleSearchCollection}>Просмотр коллекции</button>
      </div>
      <div className="home-restagle"></div>
    </div>
  );
};

export default Home;