import React from 'react';
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LectureList from "./pages/LectureList";
import NavBar from "./components/NavBar";
import "./App.css";
import "./Calendar.css";

function App() {
  return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/lectures" element={<LectureList/>}/>
            </Routes>
            <NavBar/>
        </BrowserRouter>
  );
}

export default App;