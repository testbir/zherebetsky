/* App.tsx */

import React from "react"
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddWatch from "./pages/AddWatch"
import SearchCollection from "./pages/SearchCollection"


function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-watch" element={<AddWatch />} />
        <Route path="/search-collection" element={<SearchCollection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
