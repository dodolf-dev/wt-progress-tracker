// src/components/VehicleModification/VehicleModification.jsx
import React, { useMemo, useState } from 'react';
const asset = (path) => `${process.env.PUBLIC_URL}${path}`;
const RpIcon = () => <img src={asset("/assets/img/icons/rp_icon.svg")} alt="RP" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '2px' }} />;
const SlIcon = () => <img src={asset("/assets/img/icons/sl_icon.svg")} alt="SL" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '2px' }} />;
const GeIcon = () => <img src={asset("/assets/img/icons/ge_icon.svg")} alt="GE" style={{ height: '1em', verticalAlign: 'middle', marginLeft: '4px' }} />;

// Normalise n'importe quelle valeur reçue en un niveau d'équipage 0-3.
// Garde la compat avec un éventuel ancien format booléen (true = niveau 1).
const normalizeCrewLevel = (value) => {
  if (typeof value === 'number') return Math.max(0, Math.min(3, value));
  if (value === true) return 1;
  return 0;
};

const ModificationCell = ({ modData, isResearched, modRp, onModRpChange, onPurchase, onReset }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const modRpCost = Number(modData.rp_cost) || 0;
  const modSlCost = Number(modData.sl_cost) || 0;
  const isFree = modRpCost === 0;
  const effectiveResearched = isResearched || isFree;
  const rpProgress = isFree ? 100 : modRpCost > 0 ? Math.min(100, Math.round((modRp / modRpCost) * 100)) : 0;
  const rpComplete = !isFree && modRp >= modRpCost && !effectiveResearched;
  const canPurchase = rpComplete && !effectiveResearched;

  let label;
  if (effectiveResearched) label = 'Recherché';
  else if (rpComplete) label = 'Terminé';
  else label = `${rpProgress}%`;

  const startEdit = () => {
    setEditValue(String(modRp));
    setEditing(true);
  };

  const handleInputChange = (e) => setEditValue(e.target.value);

  const confirmEdit = () => {
    const num = Number(editValue);
    if (isNaN(num) || editValue.trim() === '') {
      onModRpChange(modData.id, modRpCost);
    } else {
      onModRpChange(modData.id, Math.min(modRpCost, Math.max(0, num)));
    }
    setEditing(false);
  };

  return (
    <div
      className={`mod-cell ${canPurchase ? 'purchasable' : ''} ${effectiveResearched ? 'researched' : ''}`}
      onClick={() => { if (canPurchase) onPurchase(modData.id); }}
      style={{ cursor: canPurchase ? 'pointer' : 'default', width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div className="mod-image" style={{ flexShrink: 0 }}>
          <img src={modData.image} alt={modData.name} onError={(e) => e.target.src = '/assets/modifications/default.png'} />
        </div>
        <div style={{ flex: 1, marginLeft: '10px', minWidth: 0 }}>
          <h4
            className="mod-name"
            style={{
              margin: 0,
              fontSize: '0.95em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
            title={modData.name}
          >
            {modData.name}
          </h4>
          {!isFree && !effectiveResearched && !rpComplete && (
            <div className="mod-rp-editor" style={{ marginTop: '2px' }}>
              {editing ? (
                <span>
                  <input type="text" value={editValue} onChange={handleInputChange} onBlur={confirmEdit} onKeyDown={(e) => e.key === 'Enter' && confirmEdit()} autoFocus style={{ width: '60px' }} />
                  <button onClick={confirmEdit}>✓</button>
                </span>
              ) : (
                <span onClick={startEdit} style={{ cursor: 'pointer', borderBottom: '1px dashed #aaa' }}>
                  {modRp.toLocaleString()} / {modRpCost.toLocaleString()} <RpIcon />
                </span>
              )}
            </div>
          )}
          {rpComplete && <div className="mod-sl-cost" style={{ marginTop: '2px' }}>{modSlCost.toLocaleString()} <SlIcon /></div>}
          {effectiveResearched && !isFree && (
            <div style={{ marginTop: '2px', fontSize: '0.8em', color: '#aaa' }}>
              {modRpCost.toLocaleString()} <RpIcon /> / {modSlCost.toLocaleString()} <SlIcon />
            </div>
          )}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${effectiveResearched ? 100 : rpProgress}%` }} /></div>
        <span className="progress-text">{label}</span>
      </div>

      {!isFree && (rpComplete || effectiveResearched) && (
        <button
          onClick={(e) => { e.stopPropagation(); onReset(modData.id); }}
          style={{ marginTop: '4px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#d9534f', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Remettre à zéro"
        >
          <img src={asset('/assets/img/icons/reset_icon.svg')} alt="Reset" style={{ width: '60%', height: '60%' }} />
        </button>
      )}
    </div>
  );
};

const VehicleModifications = ({
  vehicle, onClose,
  onRpResearchedChange, onVehiclePurchase,
  onModRpChange, onModPurchase, onModReset, onVehicleReset,
  onTalismanPurchase,
  onCrewPurchasedChange,
  onAutoCompleteAll,
  onAcesRpResearchedChange,
  isResearching,
  onStopResearching,
  onSetResearching
}) => {
  const isPremium = !!vehicle?.premium;
  const geCost = vehicle?.ge_cost ?? null;
  const rpResearched = Number(vehicle?.rp_researched) || 0;
  const vehiclePurchased = vehicle?.purchased || false;
  const vehicleRpCost = Number(vehicle?.rp_cost) || 0;
  const vehicleSlCost = Number(vehicle?.sl_cost) || 0;
  const talismanCostGe = Number(vehicle?.talisman_cost_ge) || 0;
  const talismanPurchased = vehicle?.talisman_purchased || false;
  const crewTrainingSl = Number(vehicle?.crew_training_sl) || 0;
  const expertsSl = Number(vehicle?.experts_sl) || 0;
  const acesGe = Number(vehicle?.aces_ge) || 0;
  const researchAcesRp = Number(vehicle?.research_aces_rp) || 0;

  const [isEditingRp, setIsEditingRp] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // ---- ÉQUIPAGE : entièrement piloté par les props (source de vérité = le parent) ----
  // On ne garde plus de state local "de secours" : un tel state se réinitialise
  // à chaque démontage du composant (fermeture de la modale), ce qui provoquait
  // la perte du niveau d'équipage à la réouverture.
  const effectiveCrewLevel = normalizeCrewLevel(vehicle?.crewPurchased);

  // ---- RP "as" (aces) : idem, directement dérivé du véhicule fourni par le parent ----
  const acesRpResearched = Number(vehicle?.acesRpResearched) || 0;

  const [editingAcesRp, setEditingAcesRp] = useState(false);
  const [acesRpInput, setAcesRpInput] = useState('');

  const modificationsData = useMemo(() => vehicle?.modifications?.categories || {}, [vehicle]);
  const modRpValues = vehicle?.modRpValues || {};
  const researchedMods = useMemo(
  () => new Set(vehicle?.researchedMods || []),
  [vehicle?.researchedMods]
  );
  
  const allMods = useMemo(() => {
    const mods = [];
    Object.values(modificationsData).forEach(cat => Object.values(cat.mods || {}).forEach(m => mods.push(m)));
    return mods;
  }, [modificationsData]);

  const totalRpCost = allMods.reduce((s, m) => s + (Number(m.rp_cost) || 0), 0);
  const totalRpResearched = allMods.reduce((s, m) => s + (modRpValues[m.id] || 0), 0);
  const totalRpPercent = totalRpCost > 0 ? Math.min(100, Math.round((totalRpResearched / totalRpCost) * 100)) : 0;

  const totalSlCost = allMods.reduce((s, m) => s + (Number(m.sl_cost) || 0), 0);
  const totalSlSpent = allMods.reduce((s, m) => s + (researchedMods.has(m.id) ? Number(m.sl_cost) || 0 : 0), 0);

  const handleVehicleRpChange = (val) => {
    const num = Number(val);
    if (isNaN(num)) {
      onRpResearchedChange(vehicleRpCost);
      return;
    }
    const newVal = Math.min(vehicleRpCost, Math.max(0, num));
    onRpResearchedChange(newVal);
  };

  const startEditing = () => { setInputValue(String(rpResearched)); setIsEditingRp(true); };
  const handleVehicleInputChange = (e) => setInputValue(e.target.value);
  const confirmEditing = () => {
    handleVehicleRpChange(inputValue);
    setIsEditingRp(false);
  };

  const handleVehiclePurchase = () => {
    if (!vehiclePurchased) onVehiclePurchase();
  };

  // Achète le niveau d'équipage suivant. onCrewPurchasedChange DOIT persister
  // la valeur côté parent (ex: dans le state global des véhicules), sinon la
  // valeur sera reperdue à la prochaine ouverture.
  const handleCrewPurchase = () => {
    if (effectiveCrewLevel >= 3) return;
    const nextLevel = effectiveCrewLevel + 1;
    onCrewPurchasedChange?.(nextLevel);
  };

  const handleCrewReset = () => {
    onCrewPurchasedChange?.(0);
    onAcesRpResearchedChange?.(0);
    setEditingAcesRp(false);
    setAcesRpInput('');
  };

  const startAcesRpEdit = () => {
    setAcesRpInput(String(acesRpResearched));
    setEditingAcesRp(true);
  };
  const handleAcesRpInputChange = (e) => setAcesRpInput(e.target.value);
  const confirmAcesRpEdit = () => {
    const num = Number(acesRpInput);
    const val = (isNaN(num) || acesRpInput.trim() === '')
      ? researchAcesRp
      : Math.min(researchAcesRp, Math.max(0, num));

    onAcesRpResearchedChange?.(val);

    if (val >= researchAcesRp && researchAcesRp > 0 && effectiveCrewLevel < 3) {
      handleCrewPurchase();
    }
    setEditingAcesRp(false);
  };

  const vehiclePercent = vehicleRpCost > 0 ? Math.min(100, Math.round((rpResearched / vehicleRpCost) * 100)) : 0;
  const vehicleRpComplete = vehicleRpCost > 0 && rpResearched >= vehicleRpCost && !vehiclePurchased;

  const calculateGridIndex = (grid, targetRow, targetCol) => {
    let idx = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 1) {
          idx++;
          if (r === targetRow && c === targetCol) return idx;
        }
      }
    }
    return -1;
  };

  const allModsResearched = useMemo(() => {
    return Object.values(modificationsData).every(cat =>
      Object.values(cat.mods || {}).every(mod => researchedMods.has(mod.id) || Number(mod.rp_cost) === 0)
    );
  }, [modificationsData, researchedMods]);

  const isAllModsComplete = allModsResearched;

  const handleMainButtonClick = () => {
    if (!isAllModsComplete) {
      onAutoCompleteAll();
    }
  };

  if (!vehicle) return null;

  const crewLevelIcon =
    effectiveCrewLevel === 1
      ? '/assets/img/icons/base_crew.png'
      : effectiveCrewLevel === 2
        ? '/assets/img/icons/expert_crew.png'
        : effectiveCrewLevel === 3
          ? '/assets/img/icons/ace_crew.png'
          : null;

  return (
    <div className="vehicle-modifications-overlay" onClick={onClose}>
      <div className="vehicle-modifications-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <div className="modifications-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2>{vehicle.name}</h2>
                <div className="research-section">
                  {isResearching ? (
                    <button onClick={onStopResearching}>
                      ✓ Recherche en cours
                    </button>
                  ) : (
                    <button onClick={onSetResearching}>
                      🔎 Rechercher ce véhicule
                    </button>
                  )}
                </div>
            {!isAllModsComplete && (
              <button
                onClick={handleMainButtonClick}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#2196F3',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  padding: 0,
                }}
                title="Rechercher et acheter tout"
              >
                <img
                  src={asset('/assets/img/icons/spade_icon.svg')}
                  alt=""
                  style={{ width: '24px', height: '24px', filter: 'invert(1)' }}
                />
              </button>
            )}
          </div>

          {/* ---- BOUTON POSSÉDER POUR LES VÉHICULES SANS RP_COST (NON PREMIUM) ---- */}
          {!isPremium && vehicleRpCost === 0 && (
            <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
              {vehiclePurchased ? (
                <>
                  <span style={{ fontWeight: 'bold', color: '#4caf50', marginRight: '8px' }}>Possédé</span>
                  <button onClick={onVehicleReset} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#d9534f', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remettre à zéro">
                    <img src={asset('/assets/img/icons/reset_icon.svg')} alt="Reset" style={{ width: '60%', height: '60%' }} />
                  </button>
                </>
              ) : (
                <button onClick={handleVehiclePurchase} style={{ padding: '4px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Posséder
                </button>
              )}
            </div>
          )}

          {/* ---- BLOC VÉHICULE PREMIUM ---- */}
          {isPremium && (
            <div className={`vehicle-progress-section ${vehiclePurchased ? 'vehicle-purchased' : ''}`}>
              {!vehiclePurchased ? (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    Prix : {geCost ? <>{geCost.toLocaleString()}<GeIcon /></> : 'Market'}
                  </div>
                  <button onClick={handleVehiclePurchase} style={{ padding: '6px 16px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Acheter
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#4caf50', marginRight: '8px' }}>Possédé</span>
                  <button onClick={onVehicleReset} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d9534f', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remettre à zéro">
                    <img src={asset('/assets/img/icons/reset_icon.svg')} alt="Reset" style={{ width: '65%', height: '65%' }} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- BLOC VÉHICULE NORMAL (RP_COST > 0) ---- */}
          {!isPremium && vehicleRpCost > 0 && (
            <div className={`vehicle-progress-section ${vehiclePurchased ? 'vehicle-purchased' : ''}`}>
              {vehiclePurchased ? (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#4caf50', marginRight: '8px' }}>Possédé</span>
                  <button onClick={onVehicleReset} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d9534f', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remettre à zéro">
                    <img src={asset('/assets/img/icons/reset_icon.svg')} alt="Reset" style={{ width: '65%', height: '65%' }} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="progress-container" style={{ marginBottom: '8px' }}>
                    <div className="progress-bar" style={{ height: '20px' }}>
                      <div className="progress-fill" style={{ width: `${vehiclePercent}%`, backgroundColor: '#4caf50' }} />
                    </div>
                    <span className="progress-text">{`${vehiclePercent}%`}</span>
                  </div>

                  {!vehicleRpComplete && (
                    <div>
                      {isEditingRp ? (
                        <span>
                          <input type="text" value={inputValue} onChange={handleVehicleInputChange} onBlur={confirmEditing} onKeyDown={(e) => e.key === 'Enter' && confirmEditing()} autoFocus style={{ width: '80px' }} />
                          <button onClick={confirmEditing}>✓</button>
                        </span>
                      ) : (
                        <span onClick={startEditing} style={{ cursor: 'pointer', borderBottom: '1px dashed #aaa' }}>
                          {rpResearched.toLocaleString()} / {vehicleRpCost.toLocaleString()} <RpIcon />
                        </span>
                      )}
                    </div>
                  )}

                  {vehicleRpComplete && (
                    <div className="vehicle-sl-cost" onClick={handleVehiclePurchase} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                      {vehicleSlCost.toLocaleString()} <SlIcon />
                    </div>
                  )}

                  {vehicleRpComplete && (
                    <button onClick={onVehicleReset} style={{ marginTop: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d9534f', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remettre à zéro">
                      <img src={asset("/assets/img/icons/reset_icon.svg")} alt="Reset" style={{ width: '65%', height: '65%' }} />
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* ---- SECTION TALISMAN ---- */}
          {talismanCostGe > 0 ? (
            <div style={{ marginTop: '10px' }}>
              {talismanPurchased ? (
                <div style={{ display: 'flex', alignItems: 'center', color: '#4caf50', fontWeight: 'bold' }}>
                  <img src={asset("/assets/img/icons/talisman_icon.svg")} alt="Talisman" style={{ height: '1.5em', marginRight: '6px' }} />
                  <span>Talisman possédé</span>
                </div>
              ) : (
                <div>
                  <button onClick={() => onTalismanPurchase && onTalismanPurchase(vehicle.id)} style={{ padding: '6px 12px', backgroundColor: '#f7d358', border: '1px solid #e0b42c', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <img src={asset("/assets/img/icons/talisman_icon.svg")} alt="Talisman" style={{ height: '1.2em', marginRight: '6px' }} />
                    <span>Talisman</span>
                  </button>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
                    <span>{talismanCostGe.toLocaleString()}</span>
                    <GeIcon />
                  </div>
                </div>
              )}
            </div>
          ) : (
            vehiclePurchased && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', color: '#666' }}>
                <img src={asset("/assets/img/icons/talisman_icon.svg")} alt="Talisman" style={{ height: '1.5em', marginRight: '6px' }} />
              </div>
            )
          )}

          {/* ===== SECTION ÉQUIPAGE ===== */}
          <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Équipage</h3>
                {crewLevelIcon && (
                  <img
                    src={asset(crewLevelIcon)}
                    alt="Niveau équipage"
                    style={{ width: '20px', height: '20px', marginLeft: '6px' }}
                  />
                )}
              </div>

              {effectiveCrewLevel > 0 && (
                <button
                  onClick={handleCrewReset}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#d9534f',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remettre l'équipage à zéro"
                >
                  <img
                    src={asset("/assets/img/icons/reset_icon.svg")}
                    alt="Reset"
                    style={{ width: '65%', height: '65%' }}
                  />
                </button>
              )}
            </div>

            {effectiveCrewLevel === 0 && (
              <button
                onClick={handleCrewPurchase}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Acheter équipage de base ({crewTrainingSl.toLocaleString()} <SlIcon />)
              </button>
            )}

            {effectiveCrewLevel === 1 && (
              <button
                onClick={handleCrewPurchase}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Acheter équipage expert ({expertsSl.toLocaleString()} <SlIcon />)
              </button>
            )}

            {effectiveCrewLevel === 2 && (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <button
                    onClick={handleCrewPurchase}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f0ad4e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Acheter équipage as ({acesGe.toLocaleString()} <GeIcon />)
                  </button>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ marginRight: '5px' }}>Recherche as :</span>
                    {editingAcesRp ? (
                      <span>
                        <input type="text" value={acesRpInput} onChange={handleAcesRpInputChange} onBlur={confirmAcesRpEdit} onKeyDown={(e) => e.key === 'Enter' && confirmAcesRpEdit()} autoFocus style={{ width: '60px', marginLeft: '5px' }} />
                        <button onClick={confirmAcesRpEdit}>✓</button>
                      </span>
                    ) : (
                      <span onClick={startAcesRpEdit} style={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', marginLeft: '5px' }}>
                        {acesRpResearched.toLocaleString()} / {researchAcesRp.toLocaleString()} <RpIcon />
                      </span>
                    )}
                  </div>
                  <div className="progress-container" style={{ marginTop: '4px' }}>
                    <div className="progress-bar" style={{ height: '12px', backgroundColor: '#333' }}>
                      <div className="progress-fill" style={{ width: `${researchAcesRp > 0 ? Math.min(100, Math.round((acesRpResearched / researchAcesRp) * 100)) : 0}%`, backgroundColor: '#5a7', height: '100%' }} />
                    </div>
                    <span className="progress-text" style={{ fontSize: '0.75em', lineHeight: '12px' }}>
                      {researchAcesRp > 0 ? Math.min(100, Math.round((acesRpResearched / researchAcesRp) * 100)) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {effectiveCrewLevel === 3 && (
              <div style={{ fontWeight: 'bold', color: '#4caf50' }}>
                {/* Rien d'affiché, l'icône à côté du titre suffit */}
              </div>
            )}
          </div>

          {/* ---- PROGRESSION TOTALE DES MODIFICATIONS ---- */}
          {Object.keys(modificationsData).length > 0 && totalRpCost > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div className="progress-container" style={{ marginBottom: '4px' }}>
                <div className="progress-bar" style={{ height: '12px', backgroundColor: '#333' }}>
                  <div className="progress-fill" style={{ width: `${totalRpPercent}%`, backgroundColor: '#5a7', height: '100%' }} />
                </div>
                <span className="progress-text" style={{ fontSize: '0.75em', lineHeight: '12px' }}>{totalRpPercent}%</span>
              </div>
              <div style={{ fontSize: '0.85em' }}><RpIcon /> {totalRpResearched.toLocaleString()} / {totalRpCost.toLocaleString()}</div>
              <div style={{ fontSize: '0.85em', marginTop: '4px' }}><SlIcon /> {totalSlSpent.toLocaleString()} / {totalSlCost.toLocaleString()} SL</div>
            </div>
          )}
        </div>

        {/* ---- GRILLE DES MODIFICATIONS ---- */}
        {Object.keys(modificationsData).length > 0 && (
          <div className="modifications-content">
            {Object.entries(modificationsData).map(([catName, catData]) => (
              <div key={catName} className="modification-category">
                <h3>{catName}</h3>
                <div className="category-grid">
                  {catData.grid.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="mod-row">
                      {row.map((cell, colIndex) => {
                        if (cell !== 1) return <div key={`empty-${rowIndex}-${colIndex}`} className="mod-cell empty" />;
                        const idx = calculateGridIndex(catData.grid, rowIndex, colIndex);
                        const modData = catData.mods?.[idx];
                        if (!modData) return <div key={`err-${rowIndex}-${colIndex}`} className="mod-cell error">Mod manquant</div>;
                        return (
                          <ModificationCell
                            key={`mod-${rowIndex}-${colIndex}`}
                            modData={modData}
                            isResearched={researchedMods.has(modData.id)}
                            modRp={modRpValues[modData.id] || 0}
                            onModRpChange={onModRpChange}
                            onPurchase={onModPurchase}
                            onReset={onModReset}
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