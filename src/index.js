import React from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/Home';
import Error404 from './pages/Error404/Error404';
import Progress from './pages/Progress/Progress';
import Stat from './pages/Stat/Stat';

// Petit composant Header intégré directement ici
const Header = () => {
  const linkStyle = ({ isActive }) => ({
    padding: '8px 16px',
    margin: '0 4px',
    backgroundColor: isActive ? '#2196F3' : '#f0f0f0',
    color: isActive ? '#fff' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <NavLink to="/" end style={linkStyle}>Accueil</NavLink>
      <NavLink to="/stat" style={linkStyle}>Statistiques</NavLink>
      <NavLink to="/progress" style={linkStyle}>Progression</NavLink>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/stat" element={<Stat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);