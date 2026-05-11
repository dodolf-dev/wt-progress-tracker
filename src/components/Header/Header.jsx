import React from 'react';

const Header = ({ activeView, onNavigate }) => {
  const buttonStyle = (view) => ({
    padding: '8px 16px',
    margin: '0 4px',
    backgroundColor: activeView === view ? '#2196F3' : '#f0f0f0',
    color: activeView === view ? '#fff' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: activeView === view ? 'bold' : 'normal',
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
      <button style={buttonStyle('home')} onClick={() => onNavigate('home')}>
        Accueil
      </button>
      <button style={buttonStyle('stats')} onClick={() => onNavigate('stats')}>
        Statistiques
      </button>
      <button style={buttonStyle('progression')} onClick={() => onNavigate('progression')}>
        Progression
      </button>
    </div>
  );
};

export default Header;