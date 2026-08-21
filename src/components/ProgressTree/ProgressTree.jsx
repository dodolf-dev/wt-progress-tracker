import React, { useState, useRef, useEffect, useCallback } from 'react';
import { progressTree } from '../../data/progressTree';
import VehicleModifications from '../VehicleModification/VehicleModification';

const STORAGE_KEY = 'wt-progress-tracker-progress';
const SESSION_KEY = 'wt-progress-tracker-session';

const areAllModsCompleted = (vehicleData, progressEntry) => {
  const categories = vehicleData?.modifications?.categories;
  if (!categories) return false;
  const researchedSet = new Set(progressEntry?.researchedMods || []);
  for (const cat of Object.values(categories)) {
    for (const mod of Object.values(cat.mods || {})) {
      const rpCost = Number(mod.rp_cost) || 0;
      if (!(rpCost === 0 || researchedSet.has(mod.id))) return false;
    }
  }
  return true;
};
const asset = (path) => `${process.env.PUBLIC_URL}${path}`;
const RpIcon = () => <img src={asset("/assets/img/icons/rp_icon.svg")} alt="RP" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '2px' }} />;
const SlIcon = () => <img src={asset("/assets/img/icons/sl_icon.svg")} alt="SL" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '2px' }} />;
const GeIcon = () => <img src={asset("/assets/img/icons/ge_icon.svg")} alt="GE" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '4px' }} />;

const ProgressTree = ({ country, vehicle }) => {
  const treeKey = `${country.name}_${vehicle.type}`;
  const treeData = progressTree[treeKey] || progressTree.default;
  const containerRef = useRef(null);

  // ========== INITIALISATION AVEC LOCALSTORAGE & SESSIONSTORAGE ==========
  const buildInitialProgress = () => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      console.warn('Erreur de parsing localStorage, réinitialisation');
    }

    const initial = {};
    const initVehicle = (v) => {
      if (!v.id) return;
      const savedEntry = saved?.[v.id] || {};
      initial[v.id] = {
        rpResearched: savedEntry.rp_researched ?? v.rp_researched ?? 0,
        purchased: savedEntry.purchased ?? v.purchased ?? false,
        talisman_purchased: savedEntry.talisman_purchased ?? v.talisman_purchased ?? false,
        crewPurchased: Number.isInteger(savedEntry.crewPurchased) ? savedEntry.crewPurchased : (v.crewPurchased || 0),
        acesRpResearched: Number.isInteger(savedEntry.acesRpResearched) ? savedEntry.acesRpResearched : (v.acesRpResearched || 0),
        modRpValues: savedEntry.modRpValues || v.modifications?.modRpValues || {},
        researchedMods: savedEntry.researchedMods || v.modifications?.researchedMods || [],
      };
      (v.children || []).forEach(initVehicle);
    };
    (treeData.ranks || []).forEach(rank => {
      Object.values(rank.vehicles || {}).forEach(initVehicle);
    });
    return initial;
  };

  const [expandedCells, setExpandedCells] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return saved?.expandedCells || {};
    } catch {
      return {};
    }
  });

  const [collapsedRanks, setCollapsedRanks] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return new Set(saved?.collapsedRanks || []);
    } catch {
      return new Set();
    }
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleProgress, setVehicleProgress] = useState(buildInitialProgress);

  // ========== SAUVEGARDE AUTOMATIQUE (FUSION AVEC EXISTANT) ==========
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      const merged = { ...existing, ...vehicleProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Impossible de sauvegarder dans localStorage');
    }
  }, [vehicleProgress]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        expandedCells,
        collapsedRanks: Array.from(collapsedRanks),
      }));
    } catch (e) {
      console.warn('Impossible de sauvegarder dans sessionStorage');
    }
  }, [expandedCells, collapsedRanks]);

  // ========== HANDLERS ==========
  const updateVehicleProgress = useCallback((vehicleId, updates) => {
    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], ...updates },
    }));
  }, []);

  const handleRpResearchedChange = (vehicleId, newValue) => updateVehicleProgress(vehicleId, { rpResearched: newValue });
  const handleVehiclePurchase = (vehicleId) => updateVehicleProgress(vehicleId, { purchased: true });
  const handleTalismanPurchase = (vehicleId) => updateVehicleProgress(vehicleId, { talisman_purchased: true });

  const handleCrewPurchasedChange = (vehicleId, value) => updateVehicleProgress(vehicleId, { crewPurchased: value });
  const handleAcesRpResearchedChange = (vehicleId, value) => updateVehicleProgress(vehicleId, { acesRpResearched: value });

  const handleModRpChange = (vehicleId, modId, newValue) => {
    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        modRpValues: { ...prev[vehicleId].modRpValues, [modId]: newValue },
      },
    }));
  };

  const handleModPurchase = (vehicleId, modId) => {
    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        researchedMods: [...new Set([...prev[vehicleId].researchedMods, modId])],
      },
    }));
  };

  const handleModReset = (vehicleId, modId) => {
    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        modRpValues: { ...prev[vehicleId].modRpValues, [modId]: 0 },
        researchedMods: prev[vehicleId].researchedMods.filter(id => id !== modId),
      },
    }));
  };

  const handleVehicleReset = (vehicleId) => updateVehicleProgress(vehicleId, {
    rpResearched: 0,
    purchased: false,
    talisman_purchased: false,
    crewPurchased: 0,
    acesRpResearched: 0,
    modRpValues: {},
    researchedMods: [],
  });

  const handleAutoCompleteAll = (vehicleId) => {
    const vData = selectedVehicle;
    if (!vData) return;

    const modRpValues = {};
    const researchedMods = [];
    Object.values(vData.modifications?.categories || {}).forEach(cat => {
      Object.values(cat.mods || {}).forEach(mod => {
        modRpValues[mod.id] = Number(mod.rp_cost) || 0;
        researchedMods.push(mod.id);
      });
    });

    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        purchased: true,
        rp_researched: Number(vData.rp_cost) || 0,
        crewPurchased: 1,
        acesRpResearched: 0,
        modRpValues,
        researchedMods,
      },
    }));
  };

  const handleResetAllMods = (vehicleId) => {
    setVehicleProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        modRpValues: {},
        researchedMods: [],
        crewPurchased: 0,
        acesRpResearched: 0,
      },
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpandedCells({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateRankIndex = (rowGrid, targetRow, targetCol) => {
    let idx = 0;
    for (let r = 0; r < rowGrid.length; r++) {
      for (let c = 0; c < rowGrid[r].length; c++) {
        if (rowGrid[r][c] === 1) {
          idx++;
          if (r === targetRow && c === targetCol) return idx;
        }
      }
    }
    return -1;
  };

  const toggleCellExpansion = (event, rankName, rowIndex, colIndex) => {
    event.stopPropagation();
    const key = `${rankName}_${rowIndex}_${colIndex}`;
    setExpandedCells(prev => ({ [key]: !prev[key] }));
  };

  const closeAllExpandedCells = () => setExpandedCells({});

  const toggleRankCollapse = (rankName) => {
    setCollapsedRanks(prev => {
      const next = new Set(prev);
      if (next.has(rankName)) next.delete(rankName);
      else next.add(rankName);
      return next;
    });
  };

  // ... renderCell (inchangé mais il faut garder le code existant)

  const renderCell = (hasContent, rank, rowIndex, colIndex) => {
    if (!hasContent) {
      return <div key={`cell-${rowIndex}-${colIndex}`} className="grid-cell empty" />;
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

    const hasChildren = vehicleData.children && vehicleData.children.length > 0;
    const hasModifications = vehicleData.modifications && Object.keys(vehicleData.modifications.categories || {}).length > 0;
    const hasVehicleCost = vehicleData.rp_cost && vehicleData.rp_cost > 0;

    let themeClass = '';
    if (hasChildren) {
      themeClass = 'theme-normal';
    } else {
      if (vehicleData.premium) {
        themeClass = 'theme-premium';
      } else if (vehicleData.squadron) {
        themeClass = 'theme-squadron';
      } else {
        themeClass = 'theme-normal';
      }
    }

    const progress = vehicleProgress[vehicleData.id] || {};
    const rpResearched = progress.rpResearched || 0;
    const purchased = progress.purchased || false;
    const rpCost = Number(vehicleData.rp_cost) || 0;
    const slCost = Number(vehicleData.sl_cost) || 0;
    const percent = rpCost > 0 ? Math.min(100, Math.round((rpResearched / rpCost) * 100)) : 0;
    const allModsDone = areAllModsCompleted(vehicleData, progress);

    const crewLevel = Number(progress.crewPurchased) || 0;
    let crewIcon = null;
    if (crewLevel === 1) crewIcon = asset('/assets/img/icons/base_crew.png');
    else if (crewLevel === 2) crewIcon = asset('/assets/img/icons/expert_crew.png');
    else if (crewLevel === 3) crewIcon = asset('/assets/img/icons/ace_crew.png');

    let isEffectivelyPurchased = false;
    let rpComplete = false;
    let notOwned = false;

    if (hasChildren) {
      const allChildrenOwned = vehicleData.children.every(child => {
        const childProg = vehicleProgress[child.id] || {};
        const childPurchased = childProg.purchased || false;
        const childSlCost = Number(child.sl_cost) || 0;
        return childPurchased || childSlCost === 0;
      });
      notOwned = !allChildrenOwned;
    } else {
      if (rpCost === 0) {
        isEffectivelyPurchased = purchased;
        notOwned = !purchased;
      } else {
        isEffectivelyPurchased = purchased || slCost === 0;
        rpComplete = rpCost > 0 && rpResearched >= rpCost && !purchased;
        notOwned = !isEffectivelyPurchased && !rpComplete;
      }
    }

    const cellStyle = {
      opacity: 1,
      transition: 'opacity 0.2s',
      ...(notOwned && { opacity: 0.6 }),
      ...(rpComplete && !hasChildren && { opacity: 1, boxShadow: '0 0 8px rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.05)' }),
    };

    const talismanCostGe = Number(vehicleData.talisman_cost_ge) || 0;
    const talismanActive = !hasChildren && (
      (talismanCostGe > 0 && progress.talisman_purchased) ||
      (talismanCostGe === 0 && isEffectivelyPurchased)
    );

    return (
      <div
        key={`cell-${rowIndex}-${colIndex}`}
        className={`grid-cell ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''} ${themeClass}`}
        style={cellStyle}
        onClick={(e) => {
          if (hasChildren) {
            toggleCellExpansion(e, rank.name, rowIndex, colIndex);
          } else if (hasModifications || hasVehicleCost || vehicleData.premium || (rpCost === 0 && !purchased)) {
            setSelectedVehicle(vehicleData);
          }
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {allModsDone && (
            <img src={asset('/assets/img/icons/spade_icon.svg')} alt="" style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%) rotate(25deg)', width: '250%', height: '250%', opacity: 0.3, pointerEvents: 'none', zIndex: 0 }} />
          )}
          {talismanActive && (
            <img src={asset('/assets/img/icons/talisman_icon.svg')} alt="Talisman" style={{ position: 'absolute', top: '-10px', right: '-20px', width: '28px', height: '28px', zIndex: 2 }} />
          )}
          {crewIcon && (
            <img
              src={crewIcon}
              alt="Niveau équipage"
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '24px',
                height: '24px',
                zIndex: 2,
              }}
            />
          )}
          <img className="vehicle-image" src={vehicleData.image} alt={vehicleData.name} style={{ position: 'relative', zIndex: 1 }} onError={(e) => { e.target.src = '/assets/vehicles/default.png'; }} />
        </div>
        <p className="vehicle-name">{vehicleData.name}</p>

        {!hasChildren && vehicleData.premium && (
          <div className="vehicle-ge-cost" style={{ fontWeight: 'bold', fontSize: '0.9em', margin: '4px 0' }}>
            {!purchased && vehicleData.ge_cost != null && <>{vehicleData.ge_cost.toLocaleString()}<GeIcon /></>}
          </div>
        )}

        {!hasChildren && !vehicleData.premium && rpCost > 0 && !isEffectivelyPurchased && (
          <div style={{ margin: '4px 0' }}>
            <div className="progress-container">
              <progress className="progress-bar" max="100" value={percent} />
              <span className="progress-text">{percent}%</span>
            </div>
            <div style={{ fontSize: '0.8em', marginTop: '2px', textAlign: 'center' }}>
              {percent < 100 ? (
                <>{Math.max(0, rpCost - rpResearched).toLocaleString()} <RpIcon /></>
              ) : (
                <>{slCost.toLocaleString()} <SlIcon /></>
              )}
            </div>
          </div>
        )}

        {hasChildren && (
          <div className="expand-indicator">{isExpanded ? '˅' : '˃'}</div>
        )}

        {hasChildren && isExpanded && (
          <div className="children-container" onClick={(e) => e.stopPropagation()}>
            {vehicleData.children.map((child, childIndex) => {
              const childProg = vehicleProgress[child.id] || {};
              const childRp = childProg.rpResearched || 0;
              const childPurchased = childProg.purchased || false;
              const childRpCost = Number(child.rp_cost) || 0;
              const childSlCost = Number(child.sl_cost) || 0;
              const childPercent = childRpCost > 0 ? Math.min(100, Math.round((childRp / childRpCost) * 100)) : 0;
              const childHasMods = child.modifications && child.modifications.categories && Object.keys(child.modifications.categories).length > 0;
              const childHasCost = childRpCost > 0;
              const childAllModsDone = areAllModsCompleted(child, childProg);

              const childCrewLevel = Number(childProg.crewPurchased) || 0;
              let childCrewIcon = null;
              if (childCrewLevel === 1) childCrewIcon = '/assets/img/icons/base_crew.png';
              else if (childCrewLevel === 2) childCrewIcon = '/assets/img/icons/expert_crew.png';
              else if (childCrewLevel === 3) childCrewIcon = '/assets/img/icons/ace_crew.png';

              const childEffectivelyPurchased = childPurchased || childSlCost === 0;
              const childRpComplete = childRpCost > 0 && childRp >= childRpCost && !childPurchased;
              const childNotOwned = !childEffectivelyPurchased && !childRpComplete;

              let childTheme = '';
              if (child.premium) {
                childTheme = 'theme-premium';
              } else if (child.squadron) {
                childTheme = 'theme-squadron';
              } else {
                childTheme = 'theme-normal';
              }

              const childTalismanCostGe = Number(child.talisman_cost_ge) || 0;
              const childTalismanActive = (childTalismanCostGe > 0 && childProg.talisman_purchased) || (childTalismanCostGe === 0 && childEffectivelyPurchased);

              const childCellStyle = {
                opacity: 1,
                transition: 'opacity 0.2s',
                ...(childNotOwned && { opacity: 0.6 }),
                ...(childRpComplete && { opacity: 1, boxShadow: '0 0 8px rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.05)' }),
              };

              return (
                <div
                  key={`child-${childIndex}`}
                  className={`child-cell ${childTheme}`}
                  style={childCellStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (childHasMods || childHasCost || child.premium || (childRpCost === 0 && !childPurchased)) setSelectedVehicle(child);
                  }}
                >
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {childAllModsDone && (
                      <img src="/assets/img/icons/spade_icon.svg" alt="" style={{
                        position: 'absolute',
                        top: '65%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(25deg)',
                        width: '250%',
                        height: '250%',
                        opacity: 0.3,
                        pointerEvents: 'none',
                        zIndex: 0,
                      }} />
                    )}
                    {childTalismanActive && (
                      <img src="/assets/img/icons/talisman_icon.svg" alt="Talisman" style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', zIndex: 2 }} />
                    )}
                    {childCrewIcon && (
                      <img src={childCrewIcon} alt="Niveau équipage" style={{ position: 'absolute', top: '-10px', left: '-10px', width: '24px', height: '24px', zIndex: 2 }} />
                    )}
                    <img className="vehicle-image" src={child.image} alt={child.name} style={{ position: 'relative', zIndex: 1 }} onError={(e) => { e.target.src = '/assets/vehicles/default.png'; }} />
                  </div>
                  <p className="vehicle-name">{child.name}</p>

                  {child.premium && (
                    <div className="vehicle-ge-cost" style={{ fontWeight: 'bold', fontSize: '0.9em', margin: '4px 0' }}>
                      {!childPurchased && child.ge_cost != null && <>{child.ge_cost.toLocaleString()}<GeIcon /></>}
                    </div>
                  )}

                  {!child.premium && childRpCost > 0 && !childEffectivelyPurchased && (
                    <div style={{ margin: '4px 0' }}>
                      <div className="progress-container">
                        <progress className="progress-bar" max="100" value={childPercent} />
                        <span className="progress-text">{childPercent}%</span>
                      </div>
                      <div style={{ fontSize: '0.8em', marginTop: '2px', textAlign: 'center' }}>
                        {childPercent < 100 ? (
                          <>{Math.max(0, childRpCost - childRp).toLocaleString()} <RpIcon /></>
                        ) : (
                          <>{childSlCost.toLocaleString()} <SlIcon /></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderRow = (row, rowIndex, rank) => {
    const maxCells = Math.max(...rank.grid.map(r => r.length));
    const normalizedRow = [...row];
    while (normalizedRow.length < maxCells) normalizedRow.push(0);
    return (
      <div key={`row-${rowIndex}`} className="rank-row">
        {normalizedRow.map((cell, colIndex) => renderCell(cell === 1, rank, rowIndex, colIndex))}
      </div>
    );
  };

  const renderRank = (rank) => {
  const isCollapsed = collapsedRanks.has(rank.name);

  return (
    <div key={`rank-${rank.name}`} className="rank-container">
      <div className="rank-header">
        <h3 className="rank-title">Rank {rank.name}</h3>
        <button
          onClick={() => toggleRankCollapse(rank.name)}
          style={{
            marginLeft: '10px',
            background: 'none',
            border: '1px solid #aaa',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9em',
            padding: '2px 8px',
            color: 'inherit',
            transition: 'all 0.3s ease',
            boxShadow: isCollapsed ? 'inset 0 0 0 1px #aaa' : 'none',
          }}
          title={isCollapsed ? 'Afficher le rang' : 'Masquer le rang'}
        >
          {isCollapsed ? 'Afficher' : 'Masquer'}
        </button>
      </div>

      {/* Le contenu reste monté, seule la hauteur change */}
      <div
        style={{
          maxHeight: isCollapsed ? '0px' : '2000px', // hauteur max suffisante pour l'animation
          overflow: 'hidden',
          transition: 'max-height 0.6s ease-in-out', // transition identique dans les deux sens
          opacity: isCollapsed ? 0 : 1,
          transitionProperty: 'max-height, opacity',
        }}
      >
        <div className="rank-rows">
          {rank.grid.map((row, rowIndex) => renderRow(row, rowIndex, rank))}
        </div>
      </div>
    </div>
  );
};

  const totalVehicles = treeData.ranks.reduce((sum, rank) => {
    return sum + Object.values(rank.vehicles).reduce((s, v) => {
      if (v.children && v.children.length > 0) return s + v.children.length;
      return s + 1;
    }, 0);
  }, 0);

  return (
    <div className="progress-tree" ref={containerRef} onClick={closeAllExpandedCells}>
      <div className="tree-header">
        <h2>{treeData.name}</h2>
        <div className="selection-info">
          <img src={country.flag} alt={country.name} className="country-flag-small" />
          <img
            src={vehicle.icon}
            alt={vehicle.type}
            className="vehicle-icon"
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
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
        <div className="development-notice">⚠️ Y'a rien a voir bouge de la</div>
      )}

      {selectedVehicle && (
        <VehicleModifications
          vehicle={{
            ...selectedVehicle,
            rp_researched: vehicleProgress[selectedVehicle.id]?.rpResearched ?? 0,
            purchased: vehicleProgress[selectedVehicle.id]?.purchased ?? false,
            talisman_purchased: vehicleProgress[selectedVehicle.id]?.talisman_purchased ?? false,
            crewPurchased: vehicleProgress[selectedVehicle.id]?.crewPurchased ?? 0,
            acesRpResearched: vehicleProgress[selectedVehicle.id]?.acesRpResearched ?? 0,
            modRpValues: vehicleProgress[selectedVehicle.id]?.modRpValues || {},
            researchedMods: vehicleProgress[selectedVehicle.id]?.researchedMods || [],
          }}
          onRpResearchedChange={(val) => handleRpResearchedChange(selectedVehicle.id, val)}
          onVehiclePurchase={() => handleVehiclePurchase(selectedVehicle.id)}
          onTalismanPurchase={() => handleTalismanPurchase(selectedVehicle.id)}
          onCrewPurchasedChange={(val) => handleCrewPurchasedChange(selectedVehicle.id, val)}
          onAcesRpResearchedChange={(val) => handleAcesRpResearchedChange(selectedVehicle.id, val)}
          onAutoCompleteAll={() => handleAutoCompleteAll(selectedVehicle.id)}
          onResetAllMods={() => handleResetAllMods(selectedVehicle.id)}
          onModRpChange={(modId, val) => handleModRpChange(selectedVehicle.id, modId, val)}
          onModPurchase={(modId) => handleModPurchase(selectedVehicle.id, modId)}
          onModReset={(modId) => handleModReset(selectedVehicle.id, modId)}
          onVehicleReset={() => handleVehicleReset(selectedVehicle.id)}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};

export default ProgressTree;