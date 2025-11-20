import React, { useState } from 'react';
import ProgressTree from '../ProgressTree/ProgressTree';

const CountryVehicleSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  const countries = [
    { name: "USA", flag: "/assets/img/flag/country_usa.svg" },
    { name: "Germany", flag: "/assets/img/flag/country_germany.svg" },
    { name: "USSR", flag: "/assets/img/flag/country_ussr.svg" },
    { name: "Great Britain", flag: "/assets/img/flag/country_britain.svg" },
    { name: "Japan", flag: "/assets/img/flag/country_japan.svg" },
    { name: "China", flag: "/assets/img/flag/country_china.svg" },
    { name: "Italy", flag: "/assets/img/flag/country_italy.svg" },
    { name: "France", flag: "/assets/img/flag/country_france.svg" },
    { name: "Sweden", flag: "/assets/img/flag/country_sweden.svg" },
    { name: "Israel", flag: "/assets/img/flag/country_israel.svg" }
  ];

  const vehicles = [
    { type: "Avion", icon: "✈️" },
    { type: "Hélico", icon: "🚁" },
    { type: "Tank", icon: "🚛" },
    { type: "Bateau", icon: "🚢" },
    { type: "Côtier", icon: "⛵" }
  ];

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

  // AFFICHAGE DE L'ARBRE DE PROGRESSION
  if (isValidated) {
    return (
      <div className="validated-container">
        <ProgressTree 
          country={selectedCountry} 
          vehicle={selectedVehicle} 
        />
        <button className="new-selection-button" onClick={handleNewSelection}>
          ← Nouvelle sélection
        </button>
      </div>
    );
  }

  // AFFICHAGE NORMAL DU SÉLECTEUR
  return (
    <div className="selector-container">
      {/* Section pays */}
      <div className="section">
        <h2 className="section-title">
          {selectedCountry ? `Pays : ${selectedCountry.name}` : "Choisissez un pays"}
        </h2>
        <div className="countries-grid">
          {countries.map((country, index) => (
            <button
              key={index}
              className={`country-button ${selectedCountry?.name === country.name ? 'selected' : ''}`}
              onClick={() => handleCountrySelect(country)}
            >
              <img 
                src={country.flag} 
                alt={country.name}
                className="country-flag"
              />
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section véhicules */}
      {selectedCountry && (
        <div className="section">
          <h2 className="section-title">
            {selectedVehicle ? `Véhicule : ${selectedVehicle.type}` : "Choisissez un véhicule"}
          </h2>
          <div className="vehicles-grid">
            {vehicles.map((vehicle, index) => (
              <button
                key={index}
                className={`vehicle-button ${selectedVehicle?.type === vehicle.type ? 'selected' : ''}`}
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <span className="vehicle-icon">{vehicle.icon}</span>
                <span>{vehicle.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Valider */}
      {selectedCountry && selectedVehicle && (
        <div className="validation-section">
          <button className="validate-button" onClick={handleValidate}>
            ✅ Voir l'arbre de progression
          </button>
          <p className="selection-preview">
            {selectedCountry.name} - {selectedVehicle.type}
          </p>
        </div>
      )}
    </div>
  );
};

export default CountryVehicleSelector;