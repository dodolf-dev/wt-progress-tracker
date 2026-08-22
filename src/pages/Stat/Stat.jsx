// src/pages/Stat/Stat.jsx

import React, { useState, useEffect } from 'react';
import { progressTree } from '../../data/progressTree';
import { theme } from '../../styles/theme';

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

const COUNTRIES = [
  { name: 'USA', flag: asset('/assets/img/flag/country_usa.svg') },
  { name: 'Germany', flag: asset('/assets/img/flag/country_germany.svg') },
  { name: 'USSR', flag: asset('/assets/img/flag/country_ussr.svg') },
  { name: 'Great Britain', flag: asset('/assets/img/flag/country_britain.svg') },
  { name: 'Japan', flag: asset('/assets/img/flag/country_japan.svg') },
  { name: 'China', flag: asset('/assets/img/flag/country_china.svg') },
  { name: 'Italy', flag: asset('/assets/img/flag/country_italy.svg') },
  { name: 'France', flag: asset('/assets/img/flag/country_france.svg') },
  { name: 'Sweden', flag: asset('/assets/img/flag/country_sweden.svg') },
  { name: 'Israel', flag: asset('/assets/img/flag/country_israel.svg') },
];

const VEHICLE_TYPES = [
  {
    type: 'Avion',
    key: 'Avion',
    icon: asset('/assets/img/icons/avion_icon.svg'),
  },
  {
    type: 'Helico',
    key: 'Helico',
    icon: asset('/assets/img/icons/helico_icon.svg'),
  },
  {
    type: 'Tank',
    key: 'Tank',
    icon: asset('/assets/img/icons/tank_icon.svg'),
  },
  {
    type: 'Bateau',
    key: 'Bateau',
    icon: asset('/assets/img/icons/bateau_icon.svg'),
  },
  {
    type: 'Cotier',
    key: 'Cotier',
    icon: asset('/assets/img/icons/cotier_icon.svg'),
  },
];

const STORAGE_KEY = 'wt-progress-tracker-progress';

const EXCLUDED_EVENT_IDS = new Set([]);

/*
 * Exclusions manuelles pour la heatmap
 * Format: { countryName: { typeKey: [rankNames] } }
 * Utile pour les cas où des données existent mais doivent être ignorées
 */
const EXCLUDED_RANKS = {
  // Exemple: Israel: { Avion: ['I', 'II', 'III'] },
};

// Véhicules à considérer comme "communs" même s'ils sont
// normalement premium, squadron ou event.
const FORCED_COMMON_VEHICLES = [
  // Exemples :
  // "vehicle_id_1",
  // "vehicle_id_2",
];

const RpIcon = ({ size = '1em' }) => (
  <img
    src={asset('/assets/img/icons/rp_icon.svg')}
    alt="RP"
    style={{
      height: size,
      width: size,
      verticalAlign: 'middle',
      marginLeft: '4px',
    }}
  />
);

const SlIcon = ({ size = '1em' }) => (
  <img
    src={asset('/assets/img/icons/sl_icon.svg')}
    alt="SL"
    style={{
      height: size,
      width: size,
      verticalAlign: 'middle',
      marginLeft: '4px',
    }}
  />
);

const GeIcon = ({ size = '1em' }) => (
  <img
    src={asset('/assets/img/icons/ge_icon.svg')}
    alt="GE"
    style={{
      height: size,
      width: size,
      verticalAlign: 'middle',
      marginLeft: '4px',
    }}
  />
);

const getFilterButtonStyle = (active) => ({
  padding: '7px 12px',
  border: active
    ? `1px solid ${theme.colors.accent}`
    : `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  backgroundColor: active ? theme.colors.accent : 'transparent',
  color: active ? theme.colors.background : theme.colors.textMuted,
  cursor: 'pointer',
  fontWeight: active ? '600' : '400',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: active ? theme.colors.accentHover : theme.colors.surfaceLight,
  },
});

const getHeatmapStyle = (percentage) => {
  // Aucun véhicule disponible
  if (percentage === null) {
    return {
      backgroundColor: '#2a3340',
      color: '#5a6a7a',
    };
  }

  if (percentage >= 100) {
    return {
      backgroundColor: theme.colors.success,
      color: '#fff',
    };
  }

  if (percentage >= 75) {
    return {
      backgroundColor: '#4caf50',
      color: '#fff',
    };
  }

  if (percentage >= 50) {
    return {
      backgroundColor: theme.colors.warning,
      color: '#1a1a1a',
    };
  }

  if (percentage >= 25) {
    return {
      backgroundColor: '#e65100',
      color: '#fff',
    };
  }

  return {
    backgroundColor: theme.colors.danger,
    color: '#fff',
  };
};

const areAllModsCompleted = (vehicleData, progressEntry) => {
  const categories = vehicleData?.modifications?.categories;

  if (!categories) return false;

  const researchedSet = new Set(progressEntry?.researchedMods || []);

  for (const cat of Object.values(categories)) {
    for (const mod of Object.values(cat.mods || {})) {
      const rpCost = Number(mod.rp_cost) || 0;

      if (!(rpCost === 0 || researchedSet.has(mod.id))) {
        return false;
      }
    }
  }

  return true;
};

/*
 * Retourne tous les véhicules réels d'un rang.
 *
 * Certains éléments de progressTree sont des groupes possédant
 * des children. On conserve ici le même comportement que le code
 * original : le groupe lui-même n'est pas compté, seuls ses enfants
 * sont considérés comme véhicules.
 */
const getRankVehicles = (rank) => {
  const vehicles = [];

  Object.values(rank?.vehicles || {}).forEach((vehicle) => {
    if (vehicle.children && vehicle.children.length > 0) {
      vehicle.children.forEach((child) => {
        if (child?.id) {
          vehicles.push(child);
        }
      });
    } else if (vehicle?.id) {
      vehicles.push(vehicle);
    }
  });

  return vehicles;
};

/*
 * Détermine si un véhicule est "commun" ou "non commun"
 * 
 * Commun : premium === false, squadron === false, event === false
 * Non commun : premium === true, squadron === true, event === true
 * 
 * Les véhicules dans FORCED_COMMON_VEHICLES sont toujours considérés comme communs
 */
const getVehicleCategory = (vehicle) => {
  // Vérifier si le véhicule est forcé comme commun
  if (FORCED_COMMON_VEHICLES.includes(vehicle.id)) {
    return 'common';
  }

  const isSpecial = vehicle.premium || vehicle.squadron || vehicle.event;
  
  return isSpecial ? 'non-common' : 'common';
};

const Stat = () => {
  const [progressData, setProgressData] = useState(null);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [expandedRank, setExpandedRank] = useState(null);
  
  // Filtres unifiés
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRank, setFilterRank] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Réinitialisation des filtres
  const resetFilters = () => {
    setFilterCountry('all');
    setFilterType('all');
    setFilterRank('all');
    setFilterCategory('all');
  };

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
    return VEHICLE_TYPES.filter(
      (vt) => progressTree[`${countryName}_${vt.key}`]
    );
  };

  /*
   * Fonction utilitaire pour vérifier si un véhicule doit être inclus
   * selon les filtres actuels (pays, type, rang, catégorie)
   */
  const shouldIncludeVehicle = (vehicle, countryName, vehicleType, rankName) => {
    if (!vehicle?.id) return false;

    // Filtre catégorie (commun / non commun)
    if (filterCategory !== 'all') {
      const category = getVehicleCategory(vehicle);
      if (category !== filterCategory) {
        return false;
      }
    }

    return true;
  };

  /*
   * Calcule les statistiques d'un ensemble de véhicules.
   * Cette fonction sert à la fois pour les statistiques globales
   * et pour les cartes de pays.
   */
  const calculateVehicleStats = (vehicles) => {
    const stats = {
      total: 0,
      owned: 0,
      specialTotal: 0,
      specialOwned: 0,
      talismans: 0,
      baseCrew: 0,
      expertCrew: 0,
      aceCrew: 0,
      modsComplete: 0,
      totalGeSpent: 0,
    };

    vehicles.forEach((vehicle) => {
      if (!vehicle?.id) return;

      // Appliquer le filtre catégorie
      if (filterCategory !== 'all') {
        const category = getVehicleCategory(vehicle);
        if (category !== filterCategory) {
          return;
        }
      }

      const prog = progressData?.[vehicle.id] || {};
      const purchased = prog.purchased === true;

      const isSpecial =
        !EXCLUDED_EVENT_IDS.has(vehicle.id) &&
        (vehicle.premium || vehicle.squadron || vehicle.event);

      stats.total++;

      if (purchased) {
        stats.owned++;
      }

      if (isSpecial) {
        stats.specialTotal++;

        if (purchased) {
          stats.specialOwned++;
        }
      }

      if (purchased) {
        const talismanCostGe = Number(vehicle.talisman_cost_ge) || 0;

        const hasTalisman =
          talismanCostGe === 0 || prog.talisman_purchased === true;

        if (hasTalisman) {
          stats.talismans++;
        }

        if (
          hasTalisman &&
          talismanCostGe > 0 &&
          prog.talisman_purchased === true
        ) {
          stats.totalGeSpent += talismanCostGe;
        }

        const crewLevel = Number(prog.crewPurchased) || 0;

        // Compteurs cumulatifs : un équipage AS est aussi Expert et Base
        if (crewLevel >= 1) stats.baseCrew++;
        if (crewLevel >= 2) stats.expertCrew++;
        if (crewLevel >= 3) stats.aceCrew++;

        if (areAllModsCompleted(vehicle, prog)) {
          stats.modsComplete++;
        }
      }
    });

    return stats;
  };

  /*
   * Calcule les statistiques globales avec les filtres appliqués
   */
  const getGlobalStats = () => {
    const vehicles = [];

    COUNTRIES.forEach((country) => {
      // Filtre pays
      if (filterCountry !== 'all' && country.name !== filterCountry) {
        return;
      }

      getAvailableTypes(country.name).forEach((vt) => {
        // Filtre type
        if (filterType !== 'all' && vt.key !== filterType) {
          return;
        }

        const tree = progressTree[`${country.name}_${vt.key}`];

        Object.values(tree?.ranks || {}).forEach((rank) => {
          // Filtre rang
          if (filterRank !== 'all' && String(rank.name) !== String(filterRank)) {
            return;
          }

          const rankVehicles = getRankVehicles(rank);
          rankVehicles.forEach((vehicle) => {
            if (shouldIncludeVehicle(vehicle, country.name, vt.key, rank.name)) {
              vehicles.push(vehicle);
            }
          });
        });
      });
    });

    return calculateVehicleStats(vehicles);
  };

  /*
   * Calcule les statistiques d'un pays avec les filtres appliqués
   */
  const getCountryStats = (countryName) => {
    const vehicles = [];

    getAvailableTypes(countryName).forEach((vt) => {
      // Filtre type
      if (filterType !== 'all' && vt.key !== filterType) {
        return;
      }

      const tree = progressTree[`${countryName}_${vt.key}`];

      Object.values(tree?.ranks || {}).forEach((rank) => {
        // Filtre rang
        if (filterRank !== 'all' && String(rank.name) !== String(filterRank)) {
          return;
        }

        const rankVehicles = getRankVehicles(rank);
        rankVehicles.forEach((vehicle) => {
          if (shouldIncludeVehicle(vehicle, countryName, vt.key, rank.name)) {
            vehicles.push(vehicle);
          }
        });
      });
    });

    return calculateVehicleStats(vehicles);
  };

  /*
   * Calcule les totaux SL/RP pour un pays et un type avec les filtres
   */
  const getTotalsForCountryAndType = (countryName, type) => {
    const treeKey = `${countryName}_${type}`;
    const tree = progressTree[treeKey];

    if (!tree || !progressData) {
      return { sl: 0, rp: 0 };
    }

    let totalSL = 0;
    let totalRP = 0;

    const processVehicle = (vehicle) => {
      if (!vehicle?.id) return;

      // Appliquer le filtre catégorie
      if (filterCategory !== 'all') {
        const category = getVehicleCategory(vehicle);
        if (category !== filterCategory) {
          return;
        }
      }

      const prog = progressData[vehicle.id] || {};
      const purchased = prog.purchased || false;

      if (purchased) {
        totalSL += Number(vehicle.sl_cost) || 0;
      }

      totalRP += Number(prog.rp_researched) || 0;

      const mods = vehicle.modifications?.categories || {};

      Object.values(mods).forEach((cat) => {
        Object.values(cat.mods || {}).forEach((mod) => {
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

      if (crewLevel >= 1) {
        totalSL += Number(vehicle.crew_training_sl) || 0;
      }

      if (crewLevel >= 2) {
        totalSL += Number(vehicle.experts_sl) || 0;
      }

      if (vehicle.children) {
        vehicle.children.forEach((child) => processVehicle(child));
      }
    };

    Object.values(tree.ranks || {}).forEach((rank) => {
      // Filtre rang
      if (filterRank !== 'all' && String(rank.name) !== String(filterRank)) {
        return;
      }

      Object.values(rank.vehicles || {}).forEach((vehicle) => {
        if (vehicle.children && vehicle.children.length > 0) {
          vehicle.children.forEach((child) => processVehicle(child));
        } else {
          processVehicle(vehicle);
        }
      });
    });

    return {
      sl: totalSL,
      rp: totalRP,
    };
  };

  /*
   * Calcule les totaux SL/RP pour un rang avec les filtres
   */
  const getTotalsForRank = (countryName, type, rank) => {
    const treeKey = `${countryName}_${type}`;
    const tree = progressTree[treeKey];

    if (!tree || !progressData || !rank) {
      return { sl: 0, rp: 0 };
    }

    let totalSL = 0;
    let totalRP = 0;

    const processVehicle = (vehicle) => {
      if (!vehicle?.id) return;

      // Appliquer le filtre catégorie
      if (filterCategory !== 'all') {
        const category = getVehicleCategory(vehicle);
        if (category !== filterCategory) {
          return;
        }
      }

      const prog = progressData[vehicle.id] || {};
      const purchased = prog.purchased || false;

      if (purchased) {
        totalSL += Number(vehicle.sl_cost) || 0;
      }

      totalRP += Number(prog.rp_researched) || 0;

      const mods = vehicle.modifications?.categories || {};

      Object.values(mods).forEach((cat) => {
        Object.values(cat.mods || {}).forEach((mod) => {
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

      if (crewLevel >= 1) {
        totalSL += Number(vehicle.crew_training_sl) || 0;
      }

      if (crewLevel >= 2) {
        totalSL += Number(vehicle.experts_sl) || 0;
      }

      if (vehicle.children) {
        vehicle.children.forEach((child) => processVehicle(child));
      }
    };

    Object.values(rank.vehicles || {}).forEach((vehicle) => {
      if (vehicle.children && vehicle.children.length > 0) {
        vehicle.children.forEach((child) => processVehicle(child));
      } else {
        processVehicle(vehicle);
      }
    });

    return {
      sl: totalSL,
      rp: totalRP,
    };
  };

  /*
   * Statistiques détaillées d'un rang avec les filtres
   */
  const getRankStats = (countryName, typeKey, rank) => {
    const treeKey = `${countryName}_${typeKey}`;
    const tree = progressTree[treeKey];

    if (!tree || !progressData || !rank) {
      return null;
    }

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
      if (!v?.id) return;

      // Appliquer le filtre catégorie
      if (filterCategory !== 'all') {
        const category = getVehicleCategory(v);
        if (category !== filterCategory) {
          return;
        }
      }

      const prog = progressData[v.id] || {};
      const purchased = prog.purchased || false;

      const isSpecial =
        !EXCLUDED_EVENT_IDS.has(v.id) &&
        (v.premium || v.squadron || v.event);

      const owned = purchased;

      stats.total++;

      if (isSpecial) {
        stats.specialTotal++;

        if (owned) {
          stats.specialOwned++;
        }
      } else {
        stats.commonTotal++;

        if (owned) {
          stats.commonOwned++;
        }
      }

      if (owned) {
        const talismanCostGe = Number(v.talisman_cost_ge) || 0;

        const hasTalisman =
          talismanCostGe === 0 || prog.talisman_purchased === true;

        if (hasTalisman) {
          stats.talismanCount++;
        }

        if (
          hasTalisman &&
          talismanCostGe > 0 &&
          prog.talisman_purchased === true
        ) {
          stats.totalGeSpent += talismanCostGe;
        }

        const crewLevel = Number(prog.crewPurchased) || 0;

        if (crewLevel >= 1) stats.baseCrew++;
        if (crewLevel >= 2) stats.expertCrew++;
        if (crewLevel >= 3) stats.aceCrew++;

        if (areAllModsCompleted(v, prog)) {
          stats.modsComplete++;
        }
      }
    };

    Object.values(rank.vehicles || {}).forEach((vehicle) => {
      if (vehicle.children && vehicle.children.length > 0) {
        vehicle.children.forEach((child) => processVehicle(child));
      } else {
        processVehicle(vehicle);
      }
    });

    return stats;
  };

  const getCountryTotals = (countryName) => {
    let totalSL = 0;
    let totalRP = 0;

    getAvailableTypes(countryName).forEach((vt) => {
      // Filtre type
      if (filterType !== 'all' && vt.key !== filterType) {
        return;
      }

      const { sl, rp } = getTotalsForCountryAndType(
        countryName,
        vt.key
      );

      totalSL += sl;
      totalRP += rp;
    });

    return {
      sl: totalSL,
      rp: totalRP,
    };
  };

  /*
   * Statistiques simplifiées pour la carte pays
   * avec tous les filtres appliqués
   */
  const getNationCardStats = (countryName) => {
    const stats = {
      totalVehicles: 0,
      ownedVehicles: 0,
      modsComplete: 0,
      expertCrew: 0,
      sl: 0,
      rp: 0,
    };

    // Appliquer le filtre type
    let availableTypes = getAvailableTypes(countryName);
    
    if (filterType !== 'all') {
      availableTypes = availableTypes.filter(vt => vt.key === filterType);
    }

    availableTypes.forEach((vt) => {
      const treeKey = `${countryName}_${vt.key}`;
      const tree = progressTree[treeKey];

      if (!tree) return;

      // Appliquer le filtre rang
      let ranks = Object.values(tree.ranks || {});
      
      if (filterRank !== 'all') {
        ranks = ranks.filter(rank => String(rank.name) === String(filterRank));
      }

      ranks.forEach((rank) => {
        Object.values(rank.vehicles || {}).forEach((vehicle) => {
          const processVehicle = (v) => {
            if (!v?.id) return;

            // Filtrer par catégorie (commun / non commun)
            if (filterCategory !== 'all') {
              const category = getVehicleCategory(v);
              if (category !== filterCategory) {
                return;
              }
            }

            const prog = progressData[v.id] || {};
            const purchased = prog.purchased === true;

            stats.totalVehicles++;

            if (purchased) {
              stats.ownedVehicles++;
            }

            // Modifications complètes
            if (areAllModsCompleted(v, prog)) {
              stats.modsComplete++;
            }

            // Équipage expert (cumulatif)
            const crewLevel = Number(prog.crewPurchased) || 0;
            if (crewLevel >= 2) {
              stats.expertCrew++;
            }

            // SL/RP - uniquement pour les véhicules correspondant au filtre
            if (purchased) {
              stats.sl += Number(v.sl_cost) || 0;
            }

            stats.rp += Number(prog.rp_researched) || 0;

            // Mods SL/RP
            const mods = v.modifications?.categories || {};
            Object.values(mods).forEach((cat) => {
              Object.values(cat.mods || {}).forEach((mod) => {
                const modId = mod.id;
                const isResearched = (prog.researchedMods || []).includes(modId);

                if (isResearched) {
                  stats.sl += Number(mod.sl_cost) || 0;
                  stats.rp += Number(mod.rp_cost) || 0;
                } else {
                  const modRpValue = prog.modRpValues?.[modId] || 0;
                  stats.rp += Number(modRpValue) || 0;
                }
              });
            });

            // Crew training SL
            if (crewLevel >= 1) {
              stats.sl += Number(v.crew_training_sl) || 0;
            }

            // Expert SL
            if (crewLevel >= 2) {
              stats.sl += Number(v.experts_sl) || 0;
            }
          };

          if (vehicle.children?.length > 0) {
            vehicle.children.forEach(processVehicle);
          } else {
            processVehicle(vehicle);
          }
        });
      });
    });

    const completion =
      stats.totalVehicles > 0
        ? Math.round((stats.ownedVehicles / stats.totalVehicles) * 100)
        : 0;

    return {
      ...stats,
      completion,
    };
  };

  const getGlobalTotals = () => {
    let globalSL = 0;
    let globalRP = 0;

    // Appliquer les filtres aux pays affichés
    let countriesToShow = COUNTRIES;
    if (filterCountry !== 'all') {
      countriesToShow = COUNTRIES.filter(c => c.name === filterCountry);
    }

    countriesToShow.forEach((country) => {
      const totals = getCountryTotals(country.name);

      globalSL += totals.sl;
      globalRP += totals.rp;
    });

    return {
      sl: globalSL,
      rp: globalRP,
    };
  };

  /*
   * PARTIE 9 - Heatmap
   * Calcule le pourcentage de véhicules possédés pour un pays et un rang donnés,
   * en tenant compte de tous les filtres.
   * Retourne null si aucun véhicule n'existe à ce rang.
   */
  const getRankCompletion = (countryName, rankName) => {
    let total = 0;
    let owned = 0;

    // Appliquer le filtre type de véhicule
    let availableTypes = getAvailableTypes(countryName);

    if (filterType !== 'all') {
      availableTypes = availableTypes.filter(
        (vt) => vt.key === filterType
      );
    }

    availableTypes.forEach((vt) => {
      const treeKey = `${countryName}_${vt.key}`;
      const tree = progressTree[treeKey];

      if (!tree) return;

      // Vérifier les exclusions manuelles
      const excludedRanksForCountry =
        EXCLUDED_RANKS[countryName] || {};

      const excludedRanksForType =
        excludedRanksForCountry[vt.key] || [];

      if (excludedRanksForType.includes(rankName)) {
        return;
      }

      const rank = Object.values(tree.ranks || {}).find(
        (r) => String(r.name) === String(rankName)
      );

      if (!rank) return;

      Object.values(rank.vehicles || {}).forEach((vehicle) => {
        const processVehicle = (v) => {
          if (!v?.id) return;

          // Appliquer le filtre catégorie
          if (filterCategory !== 'all') {
            const category = getVehicleCategory(v);
            if (category !== filterCategory) {
              return;
            }
          }

          total++;

          const progress = progressData[v.id] || {};

          if (progress.purchased === true) {
            owned++;
          }
        };

        // Véhicule parent avec enfants
        if (vehicle.children?.length > 0) {
          vehicle.children.forEach(processVehicle);
        } else {
          processVehicle(vehicle);
        }
      });
    });

    // Aucun véhicule correspondant à ce filtre
    if (total === 0) {
      return null;
    }

    return Math.round((owned / total) * 100);
  };

  if (!progressData) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          minHeight: '100vh',
        }}
      >
        Chargement des statistiques...
      </div>
    );
  }

  const globalStats = getGlobalStats();
  const globalTotals = getGlobalTotals();

  const globalProgress =
    globalStats.total > 0
      ? Math.round((globalStats.owned / globalStats.total) * 100)
      : 0;

  /*
   * Styles communs au nouveau dashboard.
   */
  const cardStyle = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.panel,
  };

  const progressTrackStyle = {
    width: '100%',
    height: '10px',
    backgroundColor: '#2a3340',
    borderRadius: '999px',
    overflow: 'hidden',
  };

  const getProgressColor = (percent) => {
    if (percent >= 90) return theme.colors.success;
    if (percent >= 70) return '#66bb6a';
    if (percent >= 40) return theme.colors.warning;
    return theme.colors.accent;
  };

  // Nombre de filtres actifs
  const activeFiltersCount = [
    filterCountry !== 'all',
    filterType !== 'all',
    filterRank !== 'all',
    filterCategory !== 'all'
  ].filter(Boolean).length;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
      }}
    >
      {/* ========================================================= */}
      {/* DASHBOARD GLOBAL                                          */}
      {/* ========================================================= */}

      <div
        style={{
          ...cardStyle,
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                color: theme.colors.textMuted,
                fontSize: '0.85rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}
            >
              Progression globale
              {activeFiltersCount > 0 && (
                <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: theme.colors.accent }}>
                  ({activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''})
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {globalStats.owned.toLocaleString()} /{' '}
              {globalStats.total.toLocaleString()}
            </div>

            <div
              style={{
                color: theme.colors.textMuted,
                marginTop: '4px',
              }}
            >
              véhicules débloqués
            </div>
          </div>

          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: getProgressColor(globalProgress),
            }}
          >
            {globalProgress}%
          </div>
        </div>

        {/* Barre globale */}
        <div style={{ marginTop: '20px' }}>
          <div style={progressTrackStyle}>
            <div
              style={{
                width: `${globalProgress}%`,
                height: '100%',
                backgroundColor: getProgressColor(globalProgress),
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* KPI */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            marginTop: '20px',
          }}
        >
          {/* Véhicules */}
          <div
            style={{
              backgroundColor: theme.colors.surfaceLight,
              borderRadius: theme.radius.sm,
              padding: '14px',
            }}
          >
            <div
              style={{
                color: theme.colors.textMuted,
                fontSize: '0.8rem',
                marginBottom: '5px',
              }}
            >
              🚗 Véhicules
            </div>

            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {globalStats.owned.toLocaleString()}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: theme.colors.textMuted,
              }}
            >
              sur {globalStats.total.toLocaleString()}
            </div>
          </div>

          {/* Mods */}
          <div
            style={{
              backgroundColor: theme.colors.surfaceLight,
              borderRadius: theme.radius.sm,
              padding: '14px',
            }}
          >
            <div
              style={{
                color: theme.colors.textMuted,
                fontSize: '0.8rem',
                marginBottom: '5px',
              }}
            >
              🔧 Modifications complètes
            </div>

            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {globalStats.modsComplete.toLocaleString()}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: theme.colors.textMuted,
              }}
            >
              véhicules full mods
            </div>
          </div>

          {/* Équipages */}
          <div
            style={{
              backgroundColor: theme.colors.surfaceLight,
              borderRadius: theme.radius.sm,
              padding: '14px',
            }}
          >
            <div
              style={{
                color: theme.colors.textMuted,
                fontSize: '0.8rem',
                marginBottom: '8px',
              }}
            >
              👨‍✈️ Équipages
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              {/* Base */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '1.35rem',
                  fontWeight: 'bold',
                  color: theme.colors.text,
                }}
              >
                <img
                  src={asset('/assets/img/icons/base_crew.png')}
                  alt="Équipage de base"
                  style={{
                    width: '26px',
                    height: '26px',
                    objectFit: 'contain',
                  }}
                />
                {globalStats.baseCrew.toLocaleString()}
              </div>

              {/* Expert */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '1.35rem',
                  fontWeight: 'bold',
                  color: theme.colors.text,
                }}
              >
                <img
                  src={asset('/assets/img/icons/expert_crew.png')}
                  alt="Équipage expert"
                  style={{
                    width: '26px',
                    height: '26px',
                    objectFit: 'contain',
                  }}
                />
                {globalStats.expertCrew.toLocaleString()}
              </div>

              {/* AS */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '1.35rem',
                  fontWeight: 'bold',
                  color: theme.colors.text,
                }}
              >
                <img
                  src={asset('/assets/img/icons/ace_crew.png')}
                  alt="Équipage AS"
                  style={{
                    width: '26px',
                    height: '26px',
                    objectFit: 'contain',
                  }}
                />
                {globalStats.aceCrew.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: theme.colors.textMuted,
                marginTop: '6px',
              }}
            >
              base · expert · AS
            </div>
          </div>

          {/* Talismans */}
          <div
            style={{
              backgroundColor: theme.colors.surfaceLight,
              borderRadius: theme.radius.sm,
              padding: '14px',
            }}
          >
            <div
              style={{
                color: theme.colors.textMuted,
                fontSize: '0.8rem',
                marginBottom: '5px',
              }}
            >
              💎 Talismans
            </div>

            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {globalStats.talismans.toLocaleString()}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: theme.colors.textMuted,
              }}
            >
              véhicules avec talisman
            </div>
          </div>
        </div>

        {/* Dépenses globales */}
        <div
          style={{
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 'bold',
              color: theme.colors.text,
            }}
          >
            {globalTotals.sl.toLocaleString()}
            <SlIcon />
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 'bold',
              color: theme.colors.text,
            }}
          >
            {globalTotals.rp.toLocaleString()}
            <RpIcon />
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 'bold',
              color: theme.colors.accent,
            }}
          >
            {globalStats.totalGeSpent.toLocaleString()}
            <GeIcon />
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTRES UNIFIÉS                                          */}
      {/* ========================================================= */}

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.md,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              color: theme.colors.text,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.85rem',
            }}
          >
            Filtrer par
            {activeFiltersCount > 0 && (
              <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: theme.colors.accent }}>
                ({activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''})
              </span>
            )}
          </div>

          <button
            onClick={resetFilters}
            style={{
              padding: '6px 14px',
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border}`,
              background: activeFiltersCount > 0 ? theme.colors.danger : 'transparent',
              color: activeFiltersCount > 0 ? '#fff' : theme.colors.textMuted,
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.8rem',
              transition: 'all 0.15s ease',
              opacity: activeFiltersCount > 0 ? 1 : 0.5,
            }}
          >
            ↺ Réinitialiser
          </button>
        </div>

        {/* Pays */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '12px',
          }}
        >
          <button
            onClick={() => setFilterCountry('all')}
            style={getFilterButtonStyle(filterCountry === 'all')}
          >
            Tous
          </button>

          {COUNTRIES.map((country) => (
            <button
              key={country.name}
              onClick={() => setFilterCountry(country.name)}
              style={getFilterButtonStyle(
                filterCountry === country.name
              )}
            >
              <img
                src={country.flag}
                alt=""
                style={{
                  width: '20px',
                  marginRight: '5px',
                  verticalAlign: 'middle',
                }}
              />
              {country.name}
            </button>
          ))}
        </div>

        {/* Types */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '12px',
          }}
        >
          <button
            onClick={() => setFilterType('all')}
            style={getFilterButtonStyle(filterType === 'all')}
          >
            Tous
          </button>

          {VEHICLE_TYPES.map((vehicleType) => (
            <button
              key={vehicleType.key}
              onClick={() => setFilterType(vehicleType.key)}
              style={getFilterButtonStyle(
                filterType === vehicleType.key
              )}
            >
              <img
                src={vehicleType.icon}
                alt=""
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '5px',
                  verticalAlign: 'middle',
                }}
              />
              {vehicleType.type}
            </button>
          ))}
        </div>

        {/* Rangs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '5px',
              fontWeight: '600',
              color: theme.colors.textMuted,
            }}
          >
            Rang :
          </span>

          <button
            onClick={() => setFilterRank('all')}
            style={getFilterButtonStyle(filterRank === 'all')}
          >
            Tous
          </button>

          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(
            (rank) => (
              <button
                key={rank}
                onClick={() => setFilterRank(rank)}
                style={getFilterButtonStyle(filterRank === rank)}
              >
                {rank}
              </button>
            )
          )}
        </div>

        {/* Catégorie */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            paddingTop: '12px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '5px',
              fontWeight: '600',
              color: theme.colors.textMuted,
            }}
          >
            Catégorie :
          </span>

          <button
            onClick={() => setFilterCategory('all')}
            style={getFilterButtonStyle(filterCategory === 'all')}
          >
            Tous
          </button>

          <button
            onClick={() => setFilterCategory('common')}
            style={getFilterButtonStyle(filterCategory === 'common')}
          >
            Communs
          </button>

          <button
            onClick={() => setFilterCategory('non-common')}
            style={getFilterButtonStyle(filterCategory === 'non-common')}
          >
            Non communs
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PARTIE 9 - HEATMAP                                        */}
      {/* ========================================================= */}

      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.panel,
        }}
      >
        {/* Header de la heatmap */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '15px',
            marginBottom: '15px',
            flexWrap: 'wrap',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.1rem',
              color: theme.colors.text,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Progression par rang

            {filterType !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                (
                {VEHICLE_TYPES.find(
                  (vt) => vt.key === filterType
                )?.type || filterType}
                )
              </span>
            )}
            {filterRank !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                (Rang {filterRank})
              </span>
            )}
            {filterCategory !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                ({filterCategory === 'common' ? 'Communs' : 'Non communs'})
              </span>
            )}
          </h3>
        </div>

        {/* Tableau */}
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(130px, 1.5fr) repeat(8, minmax(55px, 1fr))',
              gap: '4px',
              minWidth: '650px',
            }}
          >
            {/* En-tête */}
            <div
              style={{
                padding: '8px',
                fontWeight: 'bold',
                color: theme.colors.textMuted,
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.04em',
              }}
            >
              Pays
            </div>

            {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(
              (rank) => (
                <div
                  key={rank}
                  style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: theme.colors.textMuted,
                    fontSize: '0.8rem',
                  }}
                >
                  {rank}
                </div>
              )
            )}

            {/* Pays */}
            {COUNTRIES
              .filter(
                (country) =>
                  filterCountry === 'all' ||
                  country.name === filterCountry
              )
              .map((country) => (
                <React.Fragment key={country.name}>
                  {/* Nom du pays */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      fontWeight: '600',
                      color: theme.colors.text,
                    }}
                  >
                    <img
                      src={country.flag}
                      alt=""
                      style={{
                        width: '28px',
                        height: 'auto',
                      }}
                    />

                    <span>{country.name}</span>
                  </div>

                  {/* Rangs */}
                  {[
                    'I',
                    'II',
                    'III',
                    'IV',
                    'V',
                    'VI',
                    'VII',
                    'VIII',
                  ].map((rank) => {
                    const percentage = getRankCompletion(
                      country.name,
                      rank
                    );

                    const hasVehicles = percentage !== null;

                    return (
                      <div
                        key={`${country.name}-${rank}`}
                        title={
                          hasVehicles
                            ? `${country.name} — Rang ${rank}: ${percentage}%`
                            : `${country.name} — Rang ${rank}: aucun véhicule`
                        }
                        style={{
                          ...getHeatmapStyle(percentage),
                          minHeight: '42px',
                          borderRadius: theme.radius.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          cursor: hasVehicles
                            ? 'pointer'
                            : 'default',
                          transition: 'transform 0.15s ease',
                          fontSize: '0.85rem',
                        }}
                        onClick={() => {
                          if (!hasVehicles) return;

                          setFilterCountry(country.name);
                          setFilterRank(rank);
                        }}
                        onMouseEnter={(e) => {
                          if (hasVehicles) {
                            e.currentTarget.style.transform =
                              'scale(1.05)';

                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(0,0,0,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            'scale(1)';

                          e.currentTarget.style.boxShadow =
                            'none';
                        }}
                      >
                        {hasVehicles
                          ? `${percentage}%`
                          : '—'}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* Légende */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '15px',
            fontSize: '0.8rem',
            color: theme.colors.textMuted,
          }}
        >
          {[
            ['Aucun véhicule', null],
            ['0–24%', 10],
            ['25–49%', 30],
            ['50–74%', 60],
            ['75–99%', 80],
            ['100%', 100],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: theme.radius.sm,
                  display: 'inline-block',
                  ...getHeatmapStyle(value),
                }}
              />

              {label}
            </div>
          ))}

          <span
            style={{
              marginLeft: 'auto',
              color: theme.colors.textMuted,
              fontSize: '0.75rem',
            }}
          >
            Cliquez sur une cellule pour filtrer
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RÉSUMÉ DES NATIONS                                        */}
      {/* ========================================================= */}

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '15px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.1rem',
              color: theme.colors.text,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Progression par nation
            {filterType !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                ({VEHICLE_TYPES.find(vt => vt.key === filterType)?.type || filterType})
              </span>
            )}
            {filterRank !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                (Rang {filterRank})
              </span>
            )}
            {filterCategory !== 'all' && (
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  color: theme.colors.textMuted,
                  marginLeft: '8px',
                }}
              >
                ({filterCategory === 'common' ? 'Communs' : 'Non communs'})
              </span>
            )}
          </h2>

          <span
            style={{
              fontSize: '0.85rem',
              color: theme.colors.textMuted,
            }}
          >
            {COUNTRIES.filter(
              country =>
                filterCountry === 'all' ||
                country.name === filterCountry
            ).length} nations
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '14px',
          }}
        >
          {COUNTRIES
            .filter(
              country =>
                filterCountry === 'all' ||
                country.name === filterCountry
            )
            .map((country) => {
              const isExpanded = expandedCountry === country.name;
              const countryStats = getNationCardStats(country.name);

              return (
                <div
                  key={country.name}
                  style={{
                    ...cardStyle,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  {/* En-tête de la carte pays */}
                  <div
                    onClick={() =>
                      setExpandedCountry(
                        isExpanded ? null : country.name
                      )
                    }
                    style={{
                      padding: '16px 18px',
                      cursor: 'pointer',
                      backgroundColor: isExpanded
                        ? theme.colors.surfaceLight
                        : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {/* Ligne principale */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <img
                        src={country.flag}
                        alt={country.name}
                        style={{
                          width: '42px',
                          height: 'auto',
                          borderRadius: theme.radius.sm,
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: '700',
                            color: theme.colors.text,
                          }}
                        >
                          {country.name}
                        </div>

                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: theme.colors.textMuted,
                            marginTop: '2px',
                          }}
                        >
                          {countryStats.completion}% complété
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: '700',
                          color:
                            countryStats.completion === 100
                              ? theme.colors.success
                              : theme.colors.accent,
                        }}
                      >
                        {countryStats.completion}%
                      </div>

                      <span
                        style={{
                          fontSize: '18px',
                          transform: isExpanded
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          color: theme.colors.textMuted,
                        }}
                      >
                        ▶
                      </span>
                    </div>

                    {/* Barre de progression */}
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#2a3340',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: `${countryStats.completion}%`,
                          height: '100%',
                          backgroundColor:
                            countryStats.completion === 100
                              ? theme.colors.success
                              : theme.colors.accent,
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    {/* Statistiques */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: theme.colors.surfaceLight,
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: theme.colors.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Véhicules
                        </div>

                        <strong style={{ color: theme.colors.text }}>
                          {countryStats.ownedVehicles} /{' '}
                          {countryStats.totalVehicles}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: theme.colors.surfaceLight,
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: theme.colors.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Full mods
                        </div>

                        <strong style={{ color: theme.colors.text }}>
                          {countryStats.modsComplete}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: theme.colors.surfaceLight,
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: theme.colors.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Experts
                        </div>

                        <strong style={{ color: theme.colors.text }}>
                          {countryStats.expertCrew}
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: theme.colors.surfaceLight,
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: theme.colors.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          SL
                        </div>

                        <strong
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: theme.colors.text,
                          }}
                        >
                          {countryStats.sl.toLocaleString()}
                          <SlIcon size="0.8em" />
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '6px 10px',
                          backgroundColor: theme.colors.surfaceLight,
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: theme.colors.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          RP
                        </div>

                        <strong
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: theme.colors.text,
                          }}
                        >
                          {countryStats.rp.toLocaleString()}
                          <RpIcon size="0.8em" />
                        </strong>
                      </div>
                    </div>

                    {/* Bouton / indication */}
                    <div
                      style={{
                        marginTop: '14px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: theme.colors.accent,
                      }}
                    >
                      {isExpanded
                        ? 'Masquer les détails ↑'
                        : 'Voir les détails →'}
                    </div>
                  </div>

                  {/* Détails existants (types et rangs) - AVEC FILTRES */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '10px 15px 15px 15px',
                        backgroundColor: theme.colors.surface,
                        borderTop: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      {getAvailableTypes(country.name)
                        .filter(
                          vt =>
                            filterType === 'all' ||
                            vt.key === filterType
                        )
                        .map((vt) => {
                          const typeTotals =
                            getTotalsForCountryAndType(
                              country.name,
                              vt.key
                            );

                          const typeExpanded =
                            expandedType ===
                            `${country.name}_${vt.key}`;

                          return (
                            <div
                              key={vt.key}
                              style={{ marginBottom: '5px' }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '8px 10px',
                                  backgroundColor: typeExpanded
                                    ? theme.colors.surfaceLight
                                    : 'transparent',
                                  cursor: 'pointer',
                                  borderRadius: theme.radius.sm,
                                  color: theme.colors.text,
                                }}
                                onClick={() =>
                                  setExpandedType(
                                    typeExpanded
                                      ? null
                                      : `${country.name}_${vt.key}`
                                  )
                                }
                              >
                                <img
                                  src={vt.icon}
                                  alt={vt.type}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    marginRight: '6px',
                                  }}
                                />

                                <span style={{ flex: 1 }}>
                                  {vt.type}
                                </span>

                                <span
                                  style={{
                                    marginRight: '15px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  {typeTotals.sl.toLocaleString()}
                                  <SlIcon />
                                </span>

                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  {typeTotals.rp.toLocaleString()}
                                  <RpIcon />
                                </span>
                              </div>

                              {typeExpanded && (
                                <div
                                  style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#1a222c',
                                    borderRadius: theme.radius.sm,
                                  }}
                                >
                                  {progressTree[
                                    `${country.name}_${vt.key}`
                                  ]?.ranks
                                    ?.filter(
                                      rank =>
                                        filterRank === 'all' ||
                                        String(rank.name) === String(filterRank)
                                    )
                                    .map((rank) => {
                                      const rankKey = `${country.name}_${vt.key}_${rank.name}`;
                                      const isRankExpanded =
                                        expandedRank === rankKey;

                                      const rankTotals =
                                        getTotalsForRank(
                                          country.name,
                                          vt.key,
                                          rank
                                        );

                                      const rankStats =
                                        getRankStats(
                                          country.name,
                                          vt.key,
                                          rank
                                        );

                                      const totalVehicles =
                                        rankStats
                                          ? rankStats.total
                                          : 0;

                                      const commonPercent =
                                        rankStats &&
                                        rankStats.commonTotal > 0
                                          ? Math.round(
                                              (rankStats.commonOwned /
                                                rankStats.commonTotal) *
                                                100
                                            )
                                          : 0;

                                      const specialPercent =
                                        rankStats &&
                                        rankStats.specialTotal > 0
                                          ? Math.round(
                                              (rankStats.specialOwned /
                                                rankStats.specialTotal) *
                                                100
                                            )
                                          : 0;

                                      const talismanPercent =
                                        totalVehicles > 0
                                          ? Math.round(
                                              (rankStats.talismanCount /
                                                totalVehicles) *
                                                100
                                            )
                                          : 0;

                                      const basePercent =
                                        totalVehicles > 0
                                          ? Math.round(
                                              (rankStats.baseCrew /
                                                totalVehicles) *
                                                100
                                            )
                                          : 0;

                                      const expertPercent =
                                        totalVehicles > 0
                                          ? Math.round(
                                              (rankStats.expertCrew /
                                                totalVehicles) *
                                                100
                                            )
                                          : 0;

                                      const acePercent =
                                        totalVehicles > 0
                                          ? Math.round(
                                              (rankStats.aceCrew /
                                                totalVehicles) *
                                                100
                                            )
                                          : 0;

                                      const modsPercent =
                                        totalVehicles > 0
                                          ? Math.round(
                                              (rankStats.modsComplete /
                                                totalVehicles) *
                                                100
                                            )
                                          : 0;

                                      return (
                                        <div
                                          key={rankKey}
                                          style={{
                                            marginBottom: '4px',
                                          }}
                                        >
                                          {/* En-tête du rang */}
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              padding: '6px 8px',
                                              backgroundColor: isRankExpanded
                                                ? '#2a3340'
                                                : 'transparent',
                                              cursor: 'pointer',
                                              borderRadius: theme.radius.sm,
                                              color: theme.colors.text,
                                            }}
                                            onClick={() =>
                                              setExpandedRank(
                                                isRankExpanded
                                                  ? null
                                                  : rankKey
                                              )
                                            }
                                          >
                                            <span
                                              style={{
                                                fontWeight: 'bold',
                                                flex: 1,
                                              }}
                                            >
                                              Rank {rank.name}
                                            </span>

                                            <span
                                              style={{
                                                marginRight: '15px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                              }}
                                            >
                                              {rankTotals.sl.toLocaleString()}
                                              <SlIcon />
                                            </span>

                                            <span
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                              }}
                                            >
                                              {rankTotals.rp.toLocaleString()}
                                              <RpIcon />
                                            </span>

                                            <span
                                              style={{
                                                transform: isRankExpanded
                                                  ? 'rotate(90deg)'
                                                  : 'rotate(0deg)',
                                                transition:
                                                  'transform 0.2s',
                                                marginLeft: '8px',
                                                color: theme.colors.textMuted,
                                              }}
                                            >
                                              ▶
                                            </span>
                                          </div>

                                          {/* Contenu détaillé */}
                                          {isRankExpanded && (
                                            <div
                                              style={{
                                                padding: '6px 8px',
                                                backgroundColor: '#1a222c',
                                                borderRadius: theme.radius.sm,
                                                marginTop: '4px',
                                              }}
                                            >
                                              {/* Commun */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Commun
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${commonPercent}%`,
                                                      backgroundColor:
                                                        theme.colors.success,
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.commonOwned}/
                                                  {rankStats?.commonTotal}
                                                </span>
                                              </div>

                                              {/* Événement */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Événement
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${specialPercent}%`,
                                                      backgroundColor:
                                                        '#ff9800',
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.specialOwned}/
                                                  {rankStats?.specialTotal}
                                                </span>
                                              </div>

                                              {/* Talisman */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Talisman
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${talismanPercent}%`,
                                                      backgroundColor:
                                                        '#9c27b0',
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.talismanCount}/
                                                  {totalVehicles}
                                                </span>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.accent,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                  }}
                                                >
                                                  {rankStats?.totalGeSpent.toLocaleString()}
                                                  <GeIcon />
                                                </span>
                                              </div>

                                              {/* Équipage base */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Équipage base
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${basePercent}%`,
                                                      backgroundColor:
                                                        '#4caf50',
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.baseCrew}/
                                                  {totalVehicles}
                                                </span>
                                              </div>

                                              {/* Équipage expert */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Équipage expert
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${expertPercent}%`,
                                                      backgroundColor:
                                                        '#ff9800',
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.expertCrew}/
                                                  {totalVehicles}
                                                </span>
                                              </div>

                                              {/* Équipage as */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: '3px',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Équipage as
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${acePercent}%`,
                                                      backgroundColor:
                                                        theme.colors.danger,
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.aceCrew}/
                                                  {totalVehicles}
                                                </span>
                                              </div>

                                              {/* Modifications complètes */}
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '100px',
                                                    fontSize: '0.8em',
                                                    color: theme.colors.textMuted,
                                                  }}
                                                >
                                                  Modifs complètes
                                                </span>

                                                <div
                                                  style={{
                                                    flex: 1,
                                                    backgroundColor: '#2a3340',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      width: `${modsPercent}%`,
                                                      backgroundColor:
                                                        theme.colors.accent,
                                                      height: '100%',
                                                    }}
                                                  />
                                                </div>

                                                <span
                                                  style={{
                                                    marginLeft: '8px',
                                                    fontSize: '0.8em',
                                                    minWidth: '60px',
                                                    textAlign: 'right',
                                                    color: theme.colors.text,
                                                  }}
                                                >
                                                  {rankStats?.modsComplete}/
                                                  {totalVehicles}
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
      </div>
    </div>
  );
};

export default Stat;