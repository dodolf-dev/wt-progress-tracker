import React, { useState, useRef, useEffect } from 'react';
import { progressTree } from '../../data/progressTree';

const ProgressTree = ({ country, vehicle }) => {
  const [expandedCells, setExpandedCells] = useState({});
  const treeKey = `${country.name}_${vehicle.type}`;
  const treeData = progressTree[treeKey] || progressTree.default;
  const containerRef = useRef(null);

  // Fermer les cases dépliées quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpandedCells({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Fonction pour basculer l'état d'expansion d'une cellule
  const toggleCellExpansion = (event, rankName, rowIndex, colIndex) => {
    event.stopPropagation(); // Empêche la fermeture immédiate
    const cellKey = `${rankName}_${rowIndex}_${colIndex}`;
    setExpandedCells(prev => ({
      [cellKey]: !prev[cellKey] // Ferme les autres en n'ouvrant que celle-ci
    }));
  };

  // Fonction pour fermer toutes les cases dépliées
  const closeAllExpandedCells = () => {
    setExpandedCells({});
  };

  // Fonction pour compter les véhicules uniques (enfants seulement pour les parents avec enfants)
  const countUniqueVehicles = (ranks) => {
    let count = 0;
    
    ranks.forEach(rank => {
      Object.values(rank.vehicles).forEach(vehicle => {
        if (vehicle.children && vehicle.children.length > 0) {
          // Pour les véhicules avec enfants, compter seulement les enfants
          count += vehicle.children.length;
        } else {
          // Pour les véhicules sans enfants, compter le véhicule lui-même
          count += 1;
        }
      });
    });
    
    return count;
  };

  // Fonction pour render une cellule
  const renderCell = (hasContent, rank, rowIndex, colIndex) => {
    if (!hasContent) {
      return (
        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-cell empty">
          {/* Case vide invisible mais qui conserve l'espace */}
        </div>
      );
    }

    const rankIndex = calculateRankIndex(rank.grid, rowIndex, colIndex);
    const vehicleData = rank.vehicles[rankIndex];
    const cellKey = `${rank.name}_${rowIndex}_${colIndex}`;
    const isExpanded = expandedCells[cellKey];

    if (!vehicleData) {
      return (
        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-cell error">
          <div className="error-message">Véhicule {rankIndex} manquant</div>
        </div>
      );
    }

    // Vérifier si ce véhicule a des enfants (cases à révéler)
    const hasChildren = vehicleData.children && vehicleData.children.length > 0;

    return (
      <div 
        key={`cell-${rowIndex}-${colIndex}`} 
        className={`grid-cell ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''}`}
        onClick={(e) => hasChildren && toggleCellExpansion(e, rank.name, rowIndex, colIndex)}
      >
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
        
        {/* Indicateur visuel pour les cases cliquables */}
        {hasChildren && (
          <div className="expand-indicator">
            {isExpanded ? '▼' : '▶'}
          </div>
        )}

        {/* Cases enfants qui apparaissent au clic */}
        {hasChildren && isExpanded && (
          <div className="children-container" onClick={(e) => e.stopPropagation()}>
            {vehicleData.children.map((child, childIndex) => (
              <div key={`child-${childIndex}`} className="child-cell">
                <img 
                  className="vehicle-image" 
                  src={child.image} 
                  alt={child.name}
                  onError={(e) => {
                    e.target.src = '/assets/vehicles/default.png';
                  }}
                />
                <p className="vehicle-name">{child.name}</p>
                <div className="progress-container">
                  <progress 
                    className="progress-bar" 
                    max="100" 
                    value={child.progress}
                  />
                  <span className="progress-text">{child.progress}%</span>
                </div>
                <div className="vehicle-badge">Variante</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Fonction pour render une rangée
  const renderRow = (row, rowIndex, rank) => {
    // Trouver le nombre maximum de cellules dans toutes les rangées de ce rang
    const maxCells = Math.max(...rank.grid.map(row => row.length));
    
    // S'assurer que chaque rangée a le même nombre de cellules
    const normalizedRow = [...row];
    while (normalizedRow.length < maxCells) {
      normalizedRow.push(0); // Ajouter des cellules vides si nécessaire
    }

    const cells = normalizedRow.map((cell, colIndex) => 
      renderCell(cell === 1, rank, rowIndex, colIndex)
    );

    return (
      <div key={`row-${rowIndex}`} className="rank-row">
        {cells}
      </div>
    );
  };

  // Fonction pour render un rang complet
  const renderRank = (rank, rankIndex) => {
    // Compter les véhicules uniques pour ce rang
    const rankVehiclesCount = Object.values(rank.vehicles).reduce((count, vehicle) => {
      if (vehicle.children && vehicle.children.length > 0) {
        return count + vehicle.children.length;
      }
      return count + 1;
    }, 0);

    return (
      <div key={`rank-${rank.name}`} className="rank-container">
        <div className="rank-header">
          <h3 className="rank-title">Rank {rank.name}</h3>
          <span className="rank-stats">{rankVehiclesCount} véhicules</span>
        </div>
        <div className="rank-rows">
          {rank.grid.map((row, rowIndex) => 
            renderRow(row, rowIndex, rank)
          )}
        </div>
      </div>
    );
  };

  // Calculer le total des véhicules UNIQUES (enfants seulement pour les parents avec enfants)
  const totalVehicles = countUniqueVehicles(treeData.ranks);

  return (
    <div className="progress-tree" ref={containerRef} onClick={closeAllExpandedCells}>
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
          ⚠️ Y'a rien a voir bouge de la
        </div>
      )}
    </div>
  );
};

export default ProgressTree;