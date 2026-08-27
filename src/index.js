import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/Home';
import Error404 from './pages/Error404/Error404';
import Progress from './pages/Progress/Progress';
import Stat from './pages/Stat/Stat';
import Header from './components/Header/Header';
import Tracking from './pages/Tracking/Tracking';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/stat" element={<Stat />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);