// src/pages/Stat/Stat.jsx
import React, { useState, useEffect } from 'react';
import { progressTree } from '../../data/progressTree';

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;
const COUNTRIES = [
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

const VEHICLE_TYPES = [
  { type: "Avion", key: "Avion", icon: asset("/assets/img/icons/avion_icon.svg") },
  { type: "Helico", key: "Helico", icon: asset("/assets/img/icons/helico_icon.svg") },
  { type: "Tank", key: "Tank", icon: asset("/assets/img/icons/tank_icon.svg") },
  { type: "Bateau", key: "Bateau", icon: asset("/assets/img/icons/bateau_icon.svg") },
  { type: "Cotier", key: "Cotier", icon: asset("/assets/img/icons/cotier_icon.svg") }
];

const STORAGE_KEY = 'wt-progress-tracker-progress';

// IDs de véhicules à traiter comme "communs" même s'ils sont premium/squadron/event
const EXCLUDED_EVENT_IDS = new Set([
  // Exemple : "a6m2_zero_usa", "xp-50", etc.
]);

const RpIcon = ({ size = '1em' }) => (
  <img src={asset("/assets/img/icons/rp_icon.svg")} alt="RP" style={{ height: size, width: size, verticalAlign: 'middle', marginLeft: '4px' }} />
);

const SlIcon = ({ size = '1em' }) => (
  <img src={asset("/assets/img/icons/sl_icon.svg")} alt="SL" style={{ height: size, width: size, verticalAlign: 'middle', marginLeft: '4px' }} />
);

// Ajout du composant GeIcon
const GeIcon = ({ size = '1em' }) => (
  <img src={asset("/assets/img/icons/ge_icon.svg")} alt="GE" style={{ height: size, width: size, verticalAlign: 'middle', marginLeft: '4px' }} />
);

// Copie locale de la fonction pour vérifier si toutes les modifications sont complètes
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

const Stat = () => {
  const [progressData, setProgressData] = useState(null);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [expandedRank, setExpandedRank] = useState(null); // clé pays_type_rank

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgressData(JSON.parse(saved));
      } catch (e) {
        console.warn('Erreur de parsing localStorage', e);
        setProgressData({});
      }
    } else {
      setProgressData({});
    }
  }, []);

  const getAvailableTypes = (countryName) => {
    return VEHICLE_TYPES.filter(vt => progressTree[`${countryName}_${vt.key}`]);
  };

  // Calcule les totaux SL/RP pour un pays et un type
  const getTotalsForCountryAndType = (countryName, type) => {
    const treeKey = `${countryName}_${type}`;
    const tree = progressTree[treeKey];
    if (!tree || !progressData) return { sl: 0, rp: 0 };

    let totalSL = 0;
    let totalRP = 0;

    const processVehicle = (vehicle) => {
      if (!vehicle.id) return;
      const prog = progressData[vehicle.id] || {};
      const purchased = prog.purchased || false;
      if (purchased) totalSL += Number(vehicle.sl_cost) || 0;
      totalRP += Number(prog.rp_researched) || 0;

      const mods = vehicle.modifications?.categories || {};
      Object.values(mods).forEach(cat => {
        Object.values(cat.mods || {}).forEach(mod => {
          const modId = mod.id;
          const isResearched = (prog.researchedMods || []).includes(modId);
          if (isResearched) {
            totalSL += Number(mod.sl_cost) || 0;
            totalRP += Number(mod.rp_cost) || 0;
          } else {
            const modRpValue = prog.modRpValues?.[modId] || 0;
            totalRP += Number(modRpValue) || 0;
          }
        });
      });

      const crewLevel = Number(prog.crewPurchased) || 0;
      if (crewLevel >= 1) totalSL += Number(vehicle.crew_training_sl) || 0;
      if (crewLevel >= 2) totalSL += Number(vehicle.experts_sl) || 0;
      // Pas d'ajout de RP pour l'as

      if (vehicle.children) vehicle.children.forEach(child => processVehicle(child));
    };

    Object.values(tree.ranks || {}).forEach(rank => {
      Object.values(rank.vehicles || {}).forEach(vehicle => {
        if (vehicle.children && vehicle.children.length > 0) vehicle.children.forEach(child => processVehicle(child));
        else processVehicle(vehicle);
      });
    });

    return { sl: totalSL, rp: totalRP };
  };

  // Calcule les totaux SL/RP pour un rang
  const getTotalsForRank = (countryName, type, rank) => {
    const treeKey = `${countryName}_${type}`;
    const tree = progressTree[treeKey];
    if (!tree || !progressData || !rank) return { sl: 0, rp: 0 };

    let totalSL = 0;
    let totalRP = 0;

    const processVehicle = (vehicle) => {
      if (!vehicle.id) return;
      const prog = progressData[vehicle.id] || {};
      const purchased = prog.purchased || false;
      if (purchased) totalSL += Number(vehicle.sl_cost) || 0;
      totalRP += Number(prog.rp_researched) || 0;

      const mods = vehicle.modifications?.categories || {};
      Object.values(mods).forEach(cat => {
        Object.values(cat.mods || {}).forEach(mod => {
          const modId = mod.id;
          const isResearched = (prog.researchedMods || []).includes(modId);
          if (isResearched) {
            totalSL += Number(mod.sl_cost) || 0;
            totalRP += Number(mod.rp_cost) || 0;
          } else {
            const modRpValue = prog.modRpValues?.[modId] || 0;
            totalRP += Number(modRpValue) || 0;
          }
        });
      });

      const crewLevel = Number(prog.crewPurchased) || 0;
      if (crewLevel >= 1) totalSL += Number(vehicle.crew_training_sl) || 0;
      if (crewLevel >= 2) totalSL += Number(vehicle.experts_sl) || 0;

      if (vehicle.children) vehicle.children.forEach(child => processVehicle(child));
    };

    Object.values(rank.vehicles || {}).forEach(vehicle => {
      if (vehicle.children && vehicle.children.length > 0) vehicle.children.forEach(child => processVehicle(child));
      else processVehicle(vehicle);
    });

    return { sl: totalSL, rp: totalRP };
  };

  // Calcule les statistiques détaillées d'un rang (véhicules, talismans, équipage, modifications)
  const getRankStats = (countryName, typeKey, rank) => {
    const treeKey = `${countryName}_${typeKey}`;
    const tree = progressTree[treeKey];
    if (!tree || !progressData || !rank) return null;

    const stats = {
      total: 0,
      commonTotal: 0,
      commonOwned: 0,
      specialTotal: 0,
      specialOwned: 0,
      talismanCount: 0,
      totalGeSpent: 0,
      baseCrew: 0,
      expertCrew: 0,
      aceCrew: 0,
      modsComplete: 0,
    };

    const processVehicle = (v) => {
      if (!v.id) return;
      const prog = progressData[v.id] || {};
      const purchased = prog.purchased || false;
      const isSpecial = !EXCLUDED_EVENT_IDS.has(v.id) && (v.premium || v.squadron || v.event);
      const owned = purchased;
      stats.total++;
      if (isSpecial) {
        stats.specialTotal++;
        if (owned) stats.specialOwned++;
      } else {
        stats.commonTotal++;
        if (owned) stats.commonOwned++;
      }

      if (owned) {
        // Talisman
        const talismanCostGe = Number(v.talisman_cost_ge) || 0;
        const hasTalisman = (talismanCostGe === 0) || (prog.talisman_purchased === true);
        if (hasTalisman) stats.talismanCount++;
        if (hasTalisman && talismanCostGe > 0 && prog.talisman_purchased === true) {
          stats.totalGeSpent += talismanCostGe;
        }

        // Équipage
        const crewLevel = Number(prog.crewPurchased) || 0;
        if (crewLevel >= 1) stats.baseCrew++;
        if (crewLevel >= 2) stats.expertCrew++;
        if (crewLevel >= 3) stats.aceCrew++;

        // Modifications complètes
        if (areAllModsCompleted(v, prog)) stats.modsComplete++;
      }
    };

    Object.values(rank.vehicles || {}).forEach(vehicle => {
      if (vehicle.children && vehicle.children.length > 0) {
        vehicle.children.forEach(child => processVehicle(child));
      } else {
        processVehicle(vehicle);
      }
    });

    return stats;
  };

  const getCountryTotals = (countryName) => {
    let totalSL = 0;
    let totalRP = 0;
    getAvailableTypes(countryName).forEach(vt => {
      const { sl, rp } = getTotalsForCountryAndType(countryName, vt.key);
      totalSL += sl;
      totalRP += rp;
    });
    return { sl: totalSL, rp: totalRP };
  };

  const getGlobalTotals = () => {
    let globalSL = 0;
    let globalRP = 0;
    COUNTRIES.forEach(country => {
      const totals = getCountryTotals(country.name);
      globalSL += totals.sl;
      globalRP += totals.rp;
    });
    return { sl: globalSL, rp: globalRP };
  };

  const globalTotals = getGlobalTotals();

  if (!progressData) return <div>Chargement des statistiques...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>Statistiques des dépenses</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>
            {globalTotals.sl.toLocaleString()}
            <SlIcon />
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>
            {globalTotals.rp.toLocaleString()}
            <RpIcon />
          </span>
        </div>
      </div>

      {COUNTRIES.map(country => {
        const totals = getCountryTotals(country.name);
        const isExpanded = expandedCountry === country.name;
        const availableTypes = getAvailableTypes(country.name);

        return (
          <div key={country.name} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedCountry(isExpanded ? null : country.name)}
            >
              <img src={country.flag} alt={country.name} style={{ width: '32px', height: 'auto', marginRight: '10px' }} />
              <span style={{ fontWeight: 'bold', flex: 1 }}>{country.name}</span>
              <span style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                <strong>{totals.sl.toLocaleString()}</strong>
                <SlIcon />
              </span>
              <span style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                <strong>{totals.rp.toLocaleString()}</strong>
                <RpIcon />
              </span>
              <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
            </div>

            {isExpanded && (
              <div style={{ padding: '10px 15px', backgroundColor: '#fff' }}>
                {availableTypes.map(vt => {
                  const typeTotals = getTotalsForCountryAndType(country.name, vt.key);
                  const typeExpanded = expandedType === `${country.name}_${vt.key}`;
                  return (
                    <div key={vt.key} style={{ marginBottom: '5px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 10px',
                          backgroundColor: typeExpanded ? '#e9ecef' : '#f8f9fa',
                          cursor: 'pointer',
                          borderRadius: '4px',
                        }}
                        onClick={() => setExpandedType(typeExpanded ? null : `${country.name}_${vt.key}`)}
                      >
                        <img src={vt.icon} alt={vt.type} style={{ width: '20px', height: '20px', marginRight: '6px' }} />
                        <span style={{ flex: 1 }}>{vt.type}</span>
                        <span style={{ marginRight: '15px', display: 'inline-flex', alignItems: 'center' }}>
                          {typeTotals.sl.toLocaleString()}
                          <SlIcon />
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {typeTotals.rp.toLocaleString()}
                          <RpIcon />
                        </span>
                      </div>

                      {typeExpanded && (
                        <div style={{ padding: '6px 10px', backgroundColor: '#f1f3f5' }}>
                          {progressTree[`${country.name}_${vt.key}`]?.ranks?.map(rank => {
                            const rankKey = `${country.name}_${vt.key}_${rank.name}`;
                            const isRankExpanded = expandedRank === rankKey;
                            const rankTotals = getTotalsForRank(country.name, vt.key, rank);
                            const rankStats = getRankStats(country.name, vt.key, rank);
                            const totalVehicles = rankStats ? rankStats.total : 0;
                            const commonPercent = rankStats && rankStats.commonTotal > 0 ? Math.round((rankStats.commonOwned / rankStats.commonTotal) * 100) : 0;
                            const specialPercent = rankStats && rankStats.specialTotal > 0 ? Math.round((rankStats.specialOwned / rankStats.specialTotal) * 100) : 0;
                            const talismanPercent = totalVehicles > 0 ? Math.round((rankStats.talismanCount / totalVehicles) * 100) : 0;
                            const basePercent = totalVehicles > 0 ? Math.round((rankStats.baseCrew / totalVehicles) * 100) : 0;
                            const expertPercent = totalVehicles > 0 ? Math.round((rankStats.expertCrew / totalVehicles) * 100) : 0;
                            const acePercent = totalVehicles > 0 ? Math.round((rankStats.aceCrew / totalVehicles) * 100) : 0;
                            const modsPercent = totalVehicles > 0 ? Math.round((rankStats.modsComplete / totalVehicles) * 100) : 0;

                            return (
                              <div key={rankKey} style={{ marginBottom: '4px' }}>
                                {/* En-tête du rang rétractable */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '6px 8px',
                                    backgroundColor: '#eef0f2',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                  }}
                                  onClick={() => setExpandedRank(isRankExpanded ? null : rankKey)}
                                >
                                  <span style={{ fontWeight: 'bold', flex: 1 }}>Rank {rank.name}</span>
                                  <span style={{ marginRight: '15px', display: 'inline-flex', alignItems: 'center' }}>
                                    {rankTotals.sl.toLocaleString()}
                                    <SlIcon />
                                  </span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    {rankTotals.rp.toLocaleString()}
                                    <RpIcon />
                                  </span>
                                  <span style={{ transform: isRankExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '8px' }}>▶</span>
                                </div>

                                {/* Contenu détaillé si déplié */}
                                {isRankExpanded && (
                                  <div style={{ padding: '6px 8px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginTop: '4px' }}>
                                    {/* Barre Commun */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Commun</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${commonPercent}%`, backgroundColor: '#4caf50', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.commonOwned}/{rankStats?.commonTotal}
                                      </span>
                                    </div>

                                    {/* Barre Événement */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Événement</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${specialPercent}%`, backgroundColor: '#f0ad4e', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.specialOwned}/{rankStats?.specialTotal}
                                      </span>
                                    </div>

                                    {/* Barre Talisman + GE dépensé */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Talisman</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${talismanPercent}%`, backgroundColor: '#9c27b0', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.talismanCount}/{totalVehicles}
                                      </span>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#6a1b9a', display: 'inline-flex', alignItems: 'center' }}>
                                        {rankStats?.totalGeSpent.toLocaleString()}
                                        <GeIcon />
                                      </span>
                                    </div>

                                    {/* Barre Équipage Base */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Équipage base</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${basePercent}%`, backgroundColor: '#4caf50', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.baseCrew}/{totalVehicles}
                                      </span>
                                    </div>

                                    {/* Barre Équipage Expert */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Équipage expert</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${expertPercent}%`, backgroundColor: '#f0ad4e', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.expertCrew}/{totalVehicles}
                                      </span>
                                    </div>

                                    {/* Barre Équipage As */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Équipage as</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${acePercent}%`, backgroundColor: '#d9534f', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.aceCrew}/{totalVehicles}
                                      </span>
                                    </div>

                                    {/* Barre Modifications complètes */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <span style={{ width: '100px', fontSize: '0.8em' }}>Modifs complètes</span>
                                      <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${modsPercent}%`, backgroundColor: '#2196f3', height: '100%' }} />
                                      </div>
                                      <span style={{ marginLeft: '8px', fontSize: '0.8em', minWidth: '60px', textAlign: 'right' }}>
                                        {rankStats?.modsComplete}/{totalVehicles}
                                      </span>
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
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stat;