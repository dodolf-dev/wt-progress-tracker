// src/components/Header/Header.jsx
import { NavLink } from 'react-router-dom';

const Header = () => {
  const linkStyle = ({ isActive }) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#2196F3' : '#f0f0f0',
    color: isActive ? '#fff' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
  });

  const handleResetAllData = () => {
    // Efface le localStorage (achats, progression, etc.)
    localStorage.clear();
    // Efface le sessionStorage (état de l'interface, rangs repliés, etc.)
    sessionStorage.clear();
    // Recharge la page pour repartir de zéro
    window.location.reload();
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Logo à gauche */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <NavLink to="/" end style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/icons/logoWT_stripe_flat.png`}
            alt="WT Progress Tracker"
            style={{ height: '40px', marginRight: '10px' }}
          />
        </NavLink>
      </div>

      {/* Boutons centrés */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <NavLink to="/" end style={linkStyle}>Accueil</NavLink>
        <NavLink to="/stat" style={linkStyle}>Statistiques</NavLink>
        <NavLink to="/progress" style={linkStyle}>Progression</NavLink>
      </div>

      {/* Bouton reset à droite */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleResetAllData}
          style={{
            padding: '6px 12px',
            backgroundColor: '#d9534f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          title="Effacer toutes les données (progression, achats, interface)"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Header;