// components/VehicleModifications.jsx
import React, { useState, useEffect } from 'react';

const VehicleModifications = ({ vehicle, onClose }) => {
  const [researchedMods, setResearchedMods] = useState(new Set());
  const [availableRP, setAvailableRP] = useState(0);

  // Utiliser les modifications du véhicule
  const modificationsData = vehicle?.modifications?.categories || {};
  const vehicleAvailableRP = vehicle?.modifications?.availableRP || 0;

  useEffect(() => {
    setAvailableRP(vehicleAvailableRP);
    setResearchedMods(new Set(vehicle?.modifications?.researchedMods || []));
  }, [vehicle]);

  // Calculer l'index global dans la grille
  const calculateGridIndex = (grid, targetRow, targetCol) => {
    let index = 0;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
          index++;
          if (row === targetRow && col === targetCol) {
            return index;
          }
        }
      }
    }
    return -1;
  };

  const handleResearch = (modId) => {
    // Trouver la modification dans toutes les catégories
    let mod = null;
    let categoryName = '';
    
    for (const [catName, category] of Object.entries(modificationsData)) {
      for (const modData of Object.values(category.mods)) {
        if (modData.id === modId) {
          mod = modData;
          categoryName = catName;
          break;
        }
      }
      if (mod) break;
    }

    if (mod && availableRP >= mod.cost && mod.progress < 100) {
      setResearchedMods(prev => new Set([...prev, modId]));
      setAvailableRP(prev => prev - mod.cost);
      
      // Ici vous pourriez appeler une API pour sauvegarder la recherche
      console.log(`Recherche de ${mod.name} dans ${categoryName} pour ${vehicle.name}`);
    }
  };

  const totalRP = Object.values(modificationsData)
    .flatMap(category => Object.values(category.mods))
    .reduce((sum, mod) => sum + mod.cost, 0);

  const researchedRP = Object.values(modificationsData)
    .flatMap(category => Object.values(category.mods))
    .filter(mod => researchedMods.has(mod.id))
    .reduce((sum, mod) => sum + mod.cost, 0);

  const renderModificationCell = (hasContent, category, rowIndex, colIndex) => {
    if (!hasContent) {
      return <div key={`empty-${rowIndex}-${colIndex}`} className="mod-cell empty"></div>;
    }

    const gridIndex = calculateGridIndex(category.grid, rowIndex, colIndex);
    const modData = category.mods[gridIndex];

    if (!modData) {
      return (
        <div key={`error-${rowIndex}-${colIndex}`} className="mod-cell error">
          <div className="error-message">Mod {gridIndex} manquant</div>
        </div>
      );
    }

    const isResearched = researchedMods.has(modData.id);
    const canResearch = availableRP >= modData.cost && modData.progress < 100 && !isResearched;

    return (
      <div
        key={`mod-${rowIndex}-${colIndex}`}
        className={`mod-cell ${canResearch ? 'researchable' : ''} ${isResearched ? 'researched' : ''}`}
        onClick={() => handleResearch(modData.id)}
      >
        <div className="mod-image">
          <img 
            src={modData.image} 
            alt={modData.name}
            onError={(e) => {
              e.target.src = '/assets/modifications/default.png';
            }}
          />
        </div>
        
        <div className="mod-info">
          <h4 className="mod-name">{modData.name}</h4>
          <div className="mod-cost">
            {modData.cost > 0 ? `${modData.cost}♥` : 'Gratuit'}
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${isResearched ? 100 : modData.progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {isResearched ? 'Recherché' : `${modData.progress}%`}
          </span>
        </div>

        {canResearch && (
          <div className="research-indicator">
            Recherche disponible
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (categoryName, categoryData) => {
    return (
      <div key={categoryName} className="modification-category">
        <h3 className="category-title">{categoryName}</h3>
        <div className="category-grid">
          {categoryData.grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="mod-row">
              {row.map((cell, colIndex) => 
                renderModificationCell(cell === 1, categoryData, rowIndex, colIndex)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!vehicle || !vehicle.modifications) return null;

  return (
    <div className="vehicle-modifications-overlay" onClick={onClose}>
      <div className="vehicle-modifications-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modifications-header">
          <h2>Modifications - {vehicle.name}</h2>
          <div className="rp-summary">
            <div className="available-rp">Disponible: {availableRP}♥</div>
            <div className="total-cost">Coût total: {researchedRP}/{totalRP}♥</div>
          </div>
        </div>

        <div className="modifications-content">
          {Object.entries(modificationsData).map(([categoryName, categoryData]) => 
            renderCategory(categoryName, categoryData)
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleModifications;