import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/Home';
import Error404 from './pages/Error404/Error404';
import Progress from './pages/Progress/Progress';
import Stat from './pages/Stat/Stat';
import Header from './components/Header/Header';   // ← import obligatoire

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />   {/* ← Header toujours visible, même en scrollant */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/stat" element={<Stat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);