import React from 'react';
import { progressTree } from '../../data/progressTree';

const ProgressTree = ({ country, vehicle }) => {
  const treeKey = `${country.name}_${vehicle.type}`;
  const treeData = progressTree[treeKey] || progressTree.default;

  // Fonction pour calculer l'index global DANS LE RANG
  const calculateRankIndex = (rowGrid, targetRow, targetCol) => {
    let rankIndex = 0;
    
    for (let row = 0; row < rowGrid.length; row++) {
      for (let col = 0; col < rowGrid[row].length; col++) {
        if (rowGrid[row][col] === 1) {
          rankIndex++;
          if (row === targetRow && col === targetCol) {
            return rankIndex;
          }
        }
      }
    }
    return -1;
  };

  // Fonction pour calculer le décalage (nombre de cases vides au début)
  const calculateOffset = (row) => {
    let emptyCount = 0;
    for (let cell of row) {
      if (cell === 0) {
        emptyCount++;
      } else {
        break;
      }
    }
    return emptyCount;
  };

  // Fonction pour render une cellule avec véhicule
  const renderCell = (hasContent, rank, rowIndex, colIndex) => {
    if (!hasContent) {
      return null; // Ne pas render les cases vides
    }

    const rankIndex = calculateRankIndex(rank.grid, rowIndex, colIndex);
    const vehicleData = rank.vehicles[rankIndex];

    if (!vehicleData) {
      return (
        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-cell error">
          <div className="error-message">Véhicule {rankIndex} manquant</div>
        </div>
      );
    }

    return (
      <div key={`cell-${rowIndex}-${colIndex}`} className="grid-cell">
        <img 
          className="vehicle-image" 
          src={vehicleData.image} 
          alt={vehicleData.name}
          onError={(e) => {
            e.target.src = '/assets/vehicles/default.png';
          }}
        />
        <p className="vehicle-name">{vehicleData.name}</p>
        <div className="progress-container">
          <progress 
            className="progress-bar" 
            max="100" 
            value={vehicleData.progress}
          />
          <span className="progress-text">{vehicleData.progress}%</span>
        </div>
        <div className="vehicle-badge">R{rank.name} #{rankIndex}</div>
      </div>
    );
  };

  // Fonction pour render une rangée
  const renderRow = (row, rowIndex, rank) => {
    const offset = calculateOffset(row);
    const offsetClass = `offset-${offset}`;
    
    const cells = row.map((cell, colIndex) => 
      renderCell(cell === 1, rank, rowIndex, colIndex)
    ).filter(Boolean); // Retire les null (cases vides)

    if (cells.length === 0) return null;

    return (
      <div key={`row-${rowIndex}`} className={`rank-row ${offsetClass}`}>
        {cells}
      </div>
    );
  };

  // Fonction pour render un rang complet
  const renderRank = (rank, rankIndex) => {
    const totalVehicles = Object.keys(rank.vehicles || {}).length;
    
    return (
      <div key={`rank-${rank.name}`} className="rank-container">
        <div className="rank-header">
          <h3 className="rank-title">Rang {rank.name}</h3>
          <span className="rank-stats">{totalVehicles} véhicules</span>
        </div>
        <div className="rank-rows">
          {rank.grid.map((row, rowIndex) => 
            renderRow(row, rowIndex, rank)
          ).filter(Boolean)}
        </div>
      </div>
    );
  };

  // Calculer le total des véhicules
  const totalVehicles = treeData.ranks.reduce((total, rank) => {
    return total + Object.keys(rank.vehicles || {}).length;
  }, 0);

  return (
    <div className="progress-tree">
      <div className="tree-header">
        <h2>{treeData.name}</h2>
        <div className="selection-info">
          <img 
            src={country.flag} 
            alt={country.name} 
            className="country-flag-small"
          />
          <span className="vehicle-icon">{vehicle.icon}</span>
          <span className="selection-text">{country.name} - {vehicle.type}</span>
        </div>
        <div className="tree-stats">
          <span className="stat">Rangs: {treeData.ranks.length}</span>
          <span className="stat">Véhicules: {totalVehicles}</span>
        </div>
      </div>

      <div className="tree-content">
        {treeData.ranks.map(renderRank)}
      </div>

      {treeKey in progressTree ? null : (
        <div className="development-notice">
          ⚠️ Arbre en développement - Structure par défaut affichée
        </div>
      )}
    </div>
  );
};

export default ProgressTree;