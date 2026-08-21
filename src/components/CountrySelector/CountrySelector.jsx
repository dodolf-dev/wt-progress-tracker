// src/components/CountrySelector/CountrySelector.jsx
import React, { useState } from 'react';
import ProgressTree from '../ProgressTree/ProgressTree';
import { progressTree } from '../../data/progressTree';

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

const countries = [
  { name: "USA", flag: asset("/assets/img/flag/country_usa.svg") },
  { name: "Germany", flag: asset("/assets/img/flag/country_germany.svg") },
  { name: "USSR", flag: asset("/assets/img/flag/country_ussr.svg") },
  { name: "Great Britain", flag: asset("/assets/img/flag/country_britain.svg") },
  { name: "Japan", flag: asset("/assets/img/flag/country_japan.svg") },
  { name: "China", flag: asset("/assets/img/flag/country_china.svg") },
  { name: "Italy", flag: asset("/assets/img/flag/country_italy.svg") },
  { name: "France", flag: asset("/assets/img/flag/country_france.svg") },
  { name: "Sweden", flag: asset("/assets/img/flag/country_sweden.svg") },
  { name: "Israel", flag: asset("/assets/img/flag/country_israel.svg") }
];

const allVehicleTypes = [
  { type: "Avion", icon: asset("/assets/img/icons/avion_icon.svg") },
  { type: "Helico", icon: asset("/assets/img/icons/helico_icon.svg") },
  { type: "Tank", icon: asset("/assets/img/icons/tank_icon.svg") },
  { type: "Bateau", icon: asset("/assets/img/icons/bateau_icon.svg") },
  { type: "Cotier", icon: asset("/assets/img/icons/cotier_icon.svg") }
];

const CountryVehicleSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedVehicle(null);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleValidate = () => {
    if (selectedCountry && selectedVehicle) {
      setIsValidated(true);
    }
  };

  const handleNewSelection = () => {
    setIsValidated(false);
    setSelectedCountry(null);
    setSelectedVehicle(null);
  };

  const availableTypes = selectedCountry
    ? allVehicleTypes.filter(v => progressTree[`${selectedCountry.name}_${v.type}`])
    : [];

  if (isValidated) {
    return (
      <div className="validated-container">
        <ProgressTree country={selectedCountry} vehicle={selectedVehicle} />

        {/* Bouton sticky en bas à gauche */}
        <div
          style={{
            position: 'sticky',
            bottom: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
            pointerEvents: 'none',
            marginTop: '20px',
            zIndex: 100,
          }}
        >
          <button
            className="new-selection-button"
            onClick={handleNewSelection}
            style={{
              pointerEvents: 'auto',
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1em',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              marginLeft: '20px',
            }}
          >
            ← Nouvelle sélection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="selector-container">
      <div className="section">
        <div className="countries-grid">
          {countries.map((country, index) => (
            <button
              key={index}
              className={`country-button ${selectedCountry?.name === country.name ? 'selected' : ''}`}
              onClick={() => handleCountrySelect(country)}
            >
              <img src={country.flag} alt={country.name} className="country-flag" />
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedCountry && (
        <div className="section">
          <div className="vehicles-grid">
            {availableTypes.map((vehicle, index) => (
              <button
                key={index}
                className={`vehicle-button ${selectedVehicle?.type === vehicle.type ? 'selected' : ''}`}
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <img
                  src={vehicle.icon}
                  alt={vehicle.type}
                  className="vehicle-icon"
                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                />
                <span>{vehicle.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCountry && selectedVehicle && (
        <div className="validation-section">
          <button className="validate-button" onClick={handleValidate}>
            ✅ Voir l'arbre de progression
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryVehicleSelector;