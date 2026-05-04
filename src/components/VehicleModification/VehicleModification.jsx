// src/components/VehicleModification/VehicleModification.jsx
import React, { useState, useEffect, useMemo } from 'react';

const RpIcon = () => (
  <img src="/assets/img/icons/rp_icon.svg" alt="RP" style={{ height: '1em', verticalAlign: 'middle', marginRight: '2px' }} />
);
const SlIcon = () => (
  <img src="/assets/img/icons/sl_icon.svg" alt="SL" style={{ height: '1em', verticalAlign: 'middle', marginRight: '2px' }} />
);

const ModificationCell = ({
  modData,
  researchedMods,
  modRpValues,
  onModRpChange,
  onPurchase
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const isPurchased = researchedMods.has(modData.id);
  const modRp = modRpValues[modData.id] || 0;
  const modRpCost = Number(modData.rp_cost) || 0;
  const modSlCost = Number(modData.sl_cost) || 0;
  const isFree = modRpCost === 0;

  const effectivePurchased = isPurchased || isFree;
  const rpProgress = isFree ? 100 : modRpCost > 0 ? Math.min(100, Math.round((modRp / modRpCost) * 100)) : 0;
  const rpComplete = !isFree && modRp >= modRpCost && !effectivePurchased;

  let progressLabel;
  if (effectivePurchased) progressLabel = 'Recherché';
  else if (rpComplete) progressLabel = 'Terminé';
  else progressLabel = `${rpProgress}%`;

  const canPurchase = rpComplete && !effectivePurchased;

  const startEdit = () => {
    setEditValue(modRp.toString());
    setEditing(true);
  };
  const confirmEdit = () => {
    onModRpChange(modData.id, editValue, modRpCost);
    setEditing(false);
  };

  return (
    <div
      className={`mod-cell ${canPurchase ? 'purchasable' : ''} ${effectivePurchased ? 'researched' : ''}`}
      onClick={() => { if (canPurchase) onPurchase(modData.id); }}
      style={{ cursor: canPurchase ? 'pointer' : 'default' }}
    >
      <div className="mod-image">
        <img src={modData.image} alt={modData.name} onError={(e) => { e.target.src = '/assets/modifications/default.png'; }} />
      </div>
      <div className="mod-info">
        <h4 className="mod-name">{modData.name}</h4>
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${effectivePurchased ? 100 : rpProgress}%` }} />
        </div>
        <span className="progress-text">{progressLabel}</span>
      </div>

      {!isFree && !effectivePurchased && !rpComplete && (
        <div className="mod-rp-editor">
          {editing ? (
            <span>
              <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                onBlur={confirmEdit} onKeyDown={(e) => e.key === 'Enter' && confirmEdit()}
                autoFocus min="0" max={modRpCost} style={{ width: '60px' }} />
              <button onClick={confirmEdit}>✓</button>
            </span>
          ) : (
            <span onClick={startEdit} style={{ cursor: 'pointer', borderBottom: '1px dashed #aaa' }}>
              {modRp.toLocaleString()} / {modRpCost.toLocaleString()} <RpIcon />
            </span>
          )}
        </div>
      )}

      {rpComplete && (
        <div className="mod-sl-cost">
          {modSlCost.toLocaleString()} <SlIcon />
        </div>
      )}
    </div>
  );
};

const VehicleModifications = ({ vehicle, onClose }) => {
  // État du véhicule
  const [rpResearched, setRpResearched] = useState(0);
  const [vehiclePurchased, setVehiclePurchased] = useState(false);
  const [isEditingRp, setIsEditingRp] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Modifications
  const [researchedMods, setResearchedMods] = useState(new Set());
  const [availableRP, setAvailableRP] = useState(0);
  const [availableSL, setAvailableSL] = useState(0);
  const [modRpValues, setModRpValues] = useState({});

  const modificationsData = useMemo(() => vehicle?.modifications?.categories || {}, [vehicle]);

  const vehicleRpCost = Number(vehicle?.rp_cost) || 0;
  const vehicleSlCost = Number(vehicle?.sl_cost) || 0;
  const vehicleAvailableRP = vehicle?.modifications?.availableRP || 0;
  const vehicleAvailableSL = vehicle?.modifications?.availableSL || 0;

  useEffect(() => {
    setAvailableRP(vehicleAvailableRP);
    setAvailableSL(vehicleAvailableSL);
    setResearchedMods(new Set(vehicle?.modifications?.researchedMods || []));
    setRpResearched(Number(vehicle?.rp_researched) || 0);
    setVehiclePurchased(vehicle?.purchased || false);

    const initialModValues = {};
    Object.values(modificationsData).forEach(category => {
      Object.values(category.mods || {}).forEach(mod => {
        initialModValues[mod.id] = mod.rp_researched || 0;
      });
    });
    setModRpValues(initialModValues);
  }, [vehicle, vehicleAvailableRP, vehicleAvailableSL, modificationsData]);

  // --- Totaux pour les barres globales ---
  const allMods = useMemo(() => {
    const mods = [];
    Object.values(modificationsData).forEach(cat => {
      Object.values(cat.mods || {}).forEach(mod => mods.push(mod));
    });
    return mods;
  }, [modificationsData]);

  const totalRpCost = useMemo(() => allMods.reduce((sum, mod) => sum + (Number(mod.rp_cost) || 0), 0), [allMods]);
  const totalRpResearched = useMemo(() => allMods.reduce((sum, mod) => sum + (modRpValues[mod.id] || 0), 0), [allMods, modRpValues]);
  const totalRpPercent = totalRpCost > 0 ? Math.min(100, Math.round((totalRpResearched / totalRpCost) * 100)) : 0;

  const totalSlCost = useMemo(() => allMods.reduce((sum, mod) => sum + (Number(mod.sl_cost) || 0), 0), [allMods]);
  const totalSlSpent = useMemo(() => allMods.reduce((sum, mod) => {
    return sum + (researchedMods.has(mod.id) ? (Number(mod.sl_cost) || 0) : 0);
  }, 0), [allMods, researchedMods]);

  // Progression véhicule
  const handleVehicleRpChange = (newValue) => {
    const val = Math.min(Math.max(0, Number(newValue) || 0), vehicleRpCost);
    setRpResearched(val);
  };

  const startEditingVehicleRp = () => {
    setInputValue(rpResearched.toString());
    setIsEditingRp(true);
  };

  const confirmEditingVehicleRp = () => {
    handleVehicleRpChange(inputValue);
    setIsEditingRp(false);
  };

  const handleVehiclePurchase = () => {
    if (vehiclePurchased || rpResearched < vehicleRpCost) return;
    setAvailableSL(prev => prev - vehicleSlCost);
    setVehiclePurchased(true);
  };

  const vehicleProgressPercent = vehicleRpCost > 0
    ? Math.min(100, Math.round((rpResearched / vehicleRpCost) * 100))
    : 0;
  const vehicleRpComplete = vehicleRpCost > 0 && rpResearched >= vehicleRpCost && !vehiclePurchased;
  const showVehicleSl = vehicleRpComplete;

  // Modifications
  const calculateGridIndex = (grid, targetRow, targetCol) => {
    let index = 0;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
          index++;
          if (row === targetRow && col === targetCol) return index;
        }
      }
    }
    return -1;
  };

  const handleModPurchase = (modId) => {
    let mod = null;
    for (const category of Object.values(modificationsData)) {
      if (!category.mods) continue;
      for (const modData of Object.values(category.mods)) {
        if (modData.id === modId) { mod = modData; break; }
      }
      if (mod) break;
    }

    if (mod && !researchedMods.has(modId)) {
      setAvailableSL(prev => prev - mod.sl_cost);
      setResearchedMods(prev => new Set([...prev, modId]));
    }
  };

  const handleModRpChange = (modId, newValue, maxRp) => {
    const val = Math.min(Math.max(0, Number(newValue) || 0), maxRp);
    setModRpValues(prev => ({ ...prev, [modId]: val }));
  };

  if (!vehicle) return null;

  return (
    <div className="vehicle-modifications-overlay" onClick={onClose}>
      <div className="vehicle-modifications-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <div className="modifications-header">
          <h2>{vehicle.name}</h2>

          {/* Barre de progression du véhicule */}
          {vehicleRpCost > 0 && (
            <div className={`vehicle-progress-section ${vehiclePurchased ? 'vehicle-purchased' : ''}`}>
              <div className="progress-container" style={{ marginBottom: '8px' }}>
                <div className="progress-bar" style={{ height: '20px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${vehiclePurchased ? 100 : vehicleProgressPercent}%`,
                      backgroundColor: vehiclePurchased ? '#888' : '#4caf50'
                    }}
                  />
                </div>
                <span className="progress-text">
                  {vehiclePurchased ? 'Acheté' : `${vehicleProgressPercent}%`}
                </span>
              </div>

              {!vehiclePurchased && !vehicleRpComplete && (
                <div>
                  {isEditingRp ? (
                    <span>
                      <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                        onBlur={confirmEditingVehicleRp} onKeyDown={(e) => e.key === 'Enter' && confirmEditingVehicleRp()}
                        autoFocus min="0" max={vehicleRpCost} style={{ width: '80px' }} />
                      <button onClick={confirmEditingVehicleRp}>✓</button>
                    </span>
                  ) : (
                    <span onClick={startEditingVehicleRp} style={{ cursor: 'pointer', borderBottom: '1px dashed #aaa' }}>
                      {rpResearched.toLocaleString()} / {vehicleRpCost.toLocaleString()} <RpIcon />
                    </span>
                  )}
                </div>
              )}

              {showVehicleSl && (
                <div
                  className="vehicle-sl-cost"
                  onClick={handleVehiclePurchase}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {vehicleSlCost.toLocaleString()} <SlIcon />
                </div>
              )}
            </div>
          )}

          {/* Barre de progression RP totale des modifications */}
          {Object.keys(modificationsData).length > 0 && totalRpCost > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div className="progress-container" style={{ marginBottom: '4px' }}>
                <div className="progress-bar" style={{ height: '12px', backgroundColor: '#333' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${totalRpPercent}%`,
                      backgroundColor: '#5a7',
                      height: '100%'
                    }}
                  />
                </div>
                <span className="progress-text" style={{ fontSize: '0.75em', lineHeight: '12px' }}>
                  {totalRpPercent}%
                </span>
              </div>
              <div style={{ fontSize: '0.85em' }}>
                <RpIcon /> {totalRpResearched.toLocaleString()} / {totalRpCost.toLocaleString()}
              </div>

              {/* Ligne SL simple (sans barre) */}
              <div style={{ fontSize: '0.85em', marginTop: '4px' }}>
                <SlIcon /> {totalSlSpent.toLocaleString()} / {totalSlCost.toLocaleString()} SL
              </div>
            </div>
          )}
        </div>

        {/* Grille des modifications */}
        {Object.keys(modificationsData).length > 0 && (
          <div className="modifications-content">
            {Object.entries(modificationsData).map(([categoryName, categoryData]) => (
              <div key={categoryName} className="modification-category">
                <h3 className="category-title">{categoryName}</h3>
                <div className="category-grid">
                  {categoryData.grid.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="mod-row">
                      {row.map((cell, colIndex) => {
                        if (cell !== 1) return <div key={`empty-${rowIndex}-${colIndex}`} className="mod-cell empty" />;
                        const gridIndex = calculateGridIndex(categoryData.grid, rowIndex, colIndex);
                        const modData = categoryData.mods?.[gridIndex];
                        if (!modData) return <div key={`error-${rowIndex}-${colIndex}`} className="mod-cell error">Mod manquant</div>;
                        return (
                          <ModificationCell
                            key={`mod-${rowIndex}-${colIndex}`}
                            modData={modData}
                            researchedMods={researchedMods}
                            modRpValues={modRpValues}
                            onModRpChange={handleModRpChange}
                            onPurchase={handleModPurchase}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleModifications;