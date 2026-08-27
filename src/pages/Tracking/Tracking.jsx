import React, { useEffect, useMemo, useState } from 'react';
import { progressTree } from '../../data/progressTree';

const STORAGE_KEY = 'wt-progress-tracker-progress';
const RESEARCHING_SESSION_KEY = 'wt-progress-tracker-researching';

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

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

const getVehicleProgress = (progress, vehicle) => {
  return progress[vehicle.id] || {
    rpResearched: 0,
    purchased: false,
    researchedMods: [],
    modRpValues: {},
    crewPurchased: 0,
    acesRpResearched: 0,
    talisman_purchased: false,
  };
};

/**
 * Transforme progressTree en une liste plate de véhicules.
 * Les parents possédant des children ne sont pas affichés :
 * ce sont les véhicules enfants qui sont les vrais véhicules sélectionnables.
 */
const getAllVehicles = () => {
  const vehicles = [];

  Object.entries(progressTree || {}).forEach(([treeKey, treeData]) => {
    if (!treeData?.ranks) return;

    const separatorIndex = treeKey.indexOf('_');

    const country =
      separatorIndex !== -1
        ? treeKey.substring(0, separatorIndex)
        : treeKey;

    const type =
      separatorIndex !== -1
        ? treeKey.substring(separatorIndex + 1)
        : '';

    treeData.ranks.forEach((rank) => {
      Object.values(rank.vehicles || {}).forEach((vehicle) => {
        if (!vehicle) return;

        if (vehicle.children?.length) {
          vehicle.children.forEach((child) => {
            if (!child?.id) return;

            vehicles.push({
              ...child,
              treeKey,
              country,
              type,
              rank: rank.name,
            });
          });
        } else {
          if (!vehicle.id) return;

          vehicles.push({
            ...vehicle,
            treeKey,
            country,
            type,
            rank: rank.name,
          });
        }
      });
    });
  });

  return vehicles;
};

function VehicleCard({
  vehicle,
  progress,
  status,
  onOpenProgress,
}) {
  const rpCost = Number(vehicle.rp_cost) || 0;
  const rpResearched = Number(progress.rpResearched) || 0;
  const slCost = Number(vehicle.sl_cost) || 0;

  const percent =
    rpCost > 0
      ? Math.min(100, Math.round((rpResearched / rpCost) * 100))
      : 0;

  const isPremium = !!vehicle.premium;
  const isSquadron = !!vehicle.squadron;
  const isEvent = !!vehicle.event;

  const researchedMods = progress.researchedMods || [];

  const modificationCount = Object.values(
    vehicle.modifications?.categories || {}
  ).reduce(
    (total, category) =>
      total + Object.keys(category.mods || {}).length,
    0
  );

  const researchedModificationCount = researchedMods.length;

  const spadePercent =
    modificationCount > 0
      ? Math.min(
          100,
          Math.round(
            (researchedModificationCount / modificationCount) * 100
          )
        )
      : progress.purchased
        ? 100
        : 0;

  const statusClass = `tracking-card tracking-card-${status}`;

  return (
    <div
      className={statusClass}
      onClick={() => onOpenProgress(vehicle)}
      title="Ouvrir la fiche du véhicule"
    >
      <div className="tracking-card-image-container">
        <img
            src={`https://static.encyclopedia.warthunder.com/images/${vehicle.id}.png`}
          alt={vehicle.name}
          className="tracking-card-image"
          onError={(e) => {
            e.currentTarget.src = asset(
              '/assets/vehicles/default.png'
            );
          }}
        />

        {status === 'researching' && (
          <div className="tracking-status-badge researching-badge">
            🔎 EN RECHERCHE
          </div>
        )}

        {status === 'available' && (
          <div className="tracking-status-badge available-badge">
            📘 DISPONIBLE
          </div>
        )}

        {status === 'purchase' && (
          <div className="tracking-status-badge purchase-badge">
            💰 À ACHETER
          </div>
        )}

        {status === 'unspaded' && (
          <div className="tracking-status-badge unspaded-badge">
            ⭐ NON SPADÉ
          </div>
        )}
      </div>

      <div className="tracking-card-content">
        <div className="tracking-card-header">
          <h3>{vehicle.name}</h3>

          <span className="tracking-rank">
            Rank {vehicle.rank}
          </span>
        </div>

        <div className="tracking-card-meta">
          <span>{vehicle.country}</span>
          <span>{vehicle.type}</span>
        </div>

        {(isPremium || isSquadron || isEvent) && (
          <div className="tracking-tags">
            {isPremium && (
              <span className="tracking-tag premium-tag">
                Premium
              </span>
            )}

            {isSquadron && (
              <span className="tracking-tag squadron-tag">
                Escouade
              </span>
            )}

            {isEvent && (
              <span className="tracking-tag event-tag">
                Événement
              </span>
            )}
          </div>
        )}

        {status === 'researching' && rpCost > 0 && (
          <div className="tracking-progress">
            <div className="tracking-progress-info">
              <span>Recherche RP</span>
              <strong>{percent}%</strong>
            </div>

            <div className="tracking-progress-bar">
              <div
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="tracking-progress-detail">
              {rpResearched.toLocaleString()} /{' '}
              {rpCost.toLocaleString()} RP
            </div>
          </div>
        )}

        {status === 'available' && rpCost > 1 && (
          <div className="tracking-purchase-info">
            <span>Recherche</span>
            <strong>
              {rpCost.toLocaleString()} RP
            </strong>
          </div>
        )}

        {status === 'purchase' && (
          <div className="tracking-purchase-info">
            <span>✓ Recherche terminée</span>

            {slCost > 0 && (
              <strong>
                {slCost.toLocaleString()} SL
              </strong>
            )}
          </div>
        )}

        {status === 'unspaded' && (
          <div className="tracking-progress">
            <div className="tracking-progress-info">
              <span>Progression spade</span>
              <strong>{spadePercent}%</strong>
            </div>

            <div className="tracking-progress-bar">
              <div
                style={{ width: `${spadePercent}%` }}
              />
            </div>

            <div className="tracking-progress-detail">
              {researchedModificationCount} /{' '}
              {modificationCount} modifications
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tracking() {
  const [progress, setProgress] = useState({});
  const [researchingVehicles, setResearchingVehicles] =
    useState({});

  const [activeSection, setActiveSection] =
    useState('researching');

  const [countryFilter, setCountryFilter] =
    useState('all');

  const [typeFilter, setTypeFilter] =
    useState('all');

  const [rankFilter, setRankFilter] =
    useState('all');

  const [search, setSearch] = useState('');

  const loadData = () => {
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

      const savedResearching = JSON.parse(
        sessionStorage.getItem(RESEARCHING_SESSION_KEY)
      );

      setProgress(savedProgress || {});
      setResearchingVehicles(savedResearching || {});
    } catch (error) {
      console.warn(
        'Impossible de charger les données du suivi',
        error
      );

      setProgress({});
      setResearchingVehicles({});
    }
  };

  useEffect(() => {
    loadData();

    const handleStorage = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage
      );
    };
  }, []);

  const allVehicles = useMemo(
    () => getAllVehicles(),
    []
  );

const vehiclesWithStatus = useMemo(() => {
  return allVehicles.map((vehicle) => {
    const vehicleProgress = getVehicleProgress(progress, vehicle);

    const rpCost = Number(vehicle.rp_cost) || 0;
    const rpResearched = Number(vehicleProgress.rpResearched) || 0;
    const isPurchased = !!vehicleProgress.purchased;

    // Véhicule actuellement sélectionné pour la recherche
    const isResearching =
      researchingVehicles[vehicle.treeKey] === vehicle.id;

    const rpComplete =
      rpCost > 0 &&
      rpResearched >= rpCost;

    const allModsDone = areAllModsCompleted(
      vehicle,
      vehicleProgress
    );

    let status = null;

    // 🔎 EN RECHERCHE
    // - soit le véhicule est actuellement sélectionné
    // - soit la recherche a déjà commencé (> 0 RP)
    if (
      !isPurchased &&
      !rpComplete &&
      (
        isResearching ||
        rpResearched > 0
      )
    ) {
      status = 'researching';
    }

    // 💰 À ACHETER
    else if (
      !isPurchased &&
      rpComplete
    ) {
      status = 'purchase';
    }

    // ⭐ NON SPADÉ
    else if (
      isPurchased &&
      !allModsDone
    ) {
      status = 'unspaded';
    }

    return {
      ...vehicle,
      progress: vehicleProgress,
      status,
    };
  });
}, [
  allVehicles,
  progress,
  researchingVehicles,
]);

  const countries = useMemo(() => {
    return [
      ...new Set(
        allVehicles
          .map((vehicle) => vehicle.country)
          .filter(Boolean)
      ),
    ].sort();
  }, [allVehicles]);

  const types = useMemo(() => {
    return [
      ...new Set(
        allVehicles
          .map((vehicle) => vehicle.type)
          .filter(Boolean)
      ),
    ].sort();
  }, [allVehicles]);

  const ranks = useMemo(() => {
    return [
      ...new Set(
        allVehicles
          .map((vehicle) => String(vehicle.rank))
          .filter(Boolean)
      ),
    ].sort((a, b) => Number(a) - Number(b));
  }, [allVehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vehiclesWithStatus.filter((vehicle) => {
      if (
        countryFilter !== 'all' &&
        vehicle.country !== countryFilter
      ) {
        return false;
      }

      if (
        typeFilter !== 'all' &&
        vehicle.type !== typeFilter
      ) {
        return false;
      }

      if (
        rankFilter !== 'all' &&
        String(vehicle.rank) !== rankFilter
      ) {
        return false;
      }

      if (
        normalizedSearch &&
        !vehicle.name?.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }

      return true;
    });
  }, [
    vehiclesWithStatus,
    countryFilter,
    typeFilter,
    rankFilter,
    search,
  ]);

// RECHERCHE : tous les véhicules avec un coût RP > 1
const researching = filteredVehicles.filter(
  (vehicle) => vehicle.status === 'researching'
);

// À ACHETER : recherche terminée mais véhicule pas encore acheté
const purchase = filteredVehicles.filter(
  (vehicle) => vehicle.status === 'purchase'
);

// NON SPADÉS : véhicule acheté + modifications restantes
const unspaded = filteredVehicles.filter(
  (vehicle) => vehicle.status === 'unspaded'
);

  const allResearching = vehiclesWithStatus.filter(
    (vehicle) => vehicle.status === 'researching'
  );

  const allPurchase = vehiclesWithStatus.filter(
    (vehicle) => vehicle.status === 'purchase'
  );

  const allUnspaded = vehiclesWithStatus.filter(
  (vehicle) =>
    vehicle.status === 'unspaded' &&
    vehicle.progress?.purchased === true
  );

const openVehicle = (vehicle) => {
  sessionStorage.setItem(
    'wt-progress-tracker-open-vehicle',
    JSON.stringify({
      country: vehicle.country,
      type: vehicle.type,
      vehicleId: vehicle.id,
    })
  );

  window.location.hash = '#/progress';
};

  const resetFilters = () => {
    setCountryFilter('all');
    setTypeFilter('all');
    setRankFilter('all');
    setSearch('');
  };

  const currentVehicles =
    activeSection === 'researching'
      ? researching
      : activeSection === 'purchase'
        ? purchase
        : unspaded;

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div>
          <h1>📋 Suivi</h1>
          <p>
            Retrouve rapidement les véhicules qui
            nécessitent ton attention.
          </p>
        </div>

        <button
          className="tracking-refresh-button"
          onClick={loadData}
        >
          ↻ Actualiser
        </button>
      </div>

      <div className="tracking-summary">
        <button
          className={`tracking-summary-card researching ${
            activeSection === 'researching'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('researching')
          }
        >
          <span className="summary-icon">🔎</span>
          <span className="summary-title">
            En recherche
          </span>
          <strong>{allResearching.length}</strong>
        </button>

        <button
          className={`tracking-summary-card purchase ${
            activeSection === 'purchase'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('purchase')
          }
        >
          <span className="summary-icon">💰</span>
          <span className="summary-title">
            À acheter
          </span>
          <strong>{allPurchase.length}</strong>
        </button>

        <button
          className={`tracking-summary-card unspaded ${
            activeSection === 'unspaded'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('unspaded')
          }
        >
          <span className="summary-icon">⭐</span>
          <span className="summary-title">
            Non spadés
          </span>
          <strong>{allUnspaded.length}</strong>
        </button>
      </div>

      <div className="tracking-filters">
        <input
          type="text"
          placeholder="🔍 Rechercher un véhicule..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={countryFilter}
          onChange={(e) =>
            setCountryFilter(e.target.value)
          }
        >
          <option value="all">
            Toutes les nations
          </option>

          {countries.map((country) => (
            <option
              key={country}
              value={country}
            >
              {country}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="all">
            Tous les types
          </option>

          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={rankFilter}
          onChange={(e) =>
            setRankFilter(e.target.value)
          }
        >
          <option value="all">
            Tous les rangs
          </option>

          {ranks.map((rank) => (
            <option key={rank} value={rank}>
              Rank {rank}
            </option>
          ))}
        </select>

        <button
          className="tracking-reset-filters"
          onClick={resetFilters}
        >
          Réinitialiser
        </button>
      </div>

      <div className="tracking-section">
        <div className="tracking-section-header">
          <div>
            {activeSection === 'researching' && (
              <>
                <h2>🔎 Véhicules en recherche</h2>
                <p>
                  Véhicules actuellement sélectionnés
                  pour la recherche.
                </p>
              </>
            )}

            {activeSection === 'purchase' && (
              <>
                <h2>💰 Véhicules à acheter</h2>
                <p>
                  Recherche RP terminée, mais véhicule
                  pas encore acheté.
                </p>
              </>
            )}

            {activeSection === 'unspaded' && (
              <>
                <h2>⭐ Véhicules non spadés</h2>
                <p>
                  Véhicules achetés dont toutes les
                  modifications ne sont pas encore
                  recherchées.
                </p>
              </>
            )}
          </div>

          <span className="tracking-count">
            {currentVehicles.length} véhicule
            {currentVehicles.length > 1 ? 's' : ''}
          </span>
        </div>

        {currentVehicles.length > 0 ? (
          <div className="tracking-grid">
            {currentVehicles.map((vehicle) => (
              <VehicleCard
                key={`${vehicle.treeKey}-${vehicle.id}`}
                vehicle={vehicle}
                progress={vehicle.progress}
                status={vehicle.status}
                onOpenProgress={openVehicle}
              />
            ))}
          </div>
        ) : (
          <div className="tracking-empty">
            <div>
              {activeSection === 'researching' && '🔎'}
              {activeSection === 'purchase' && '💰'}
              {activeSection === 'unspaded' && '⭐'}
            </div>

            <h3>
              Aucun véhicule dans cette catégorie
            </h3>

            <p>
              Modifie tes filtres ou continue ta
              progression !
            </p>
          </div>
        )}
      </div>

      <style>{`
        .tracking-page {
          max-width: 1500px;
          margin: 0 auto;
          padding: 30px;
          color: #e5e7eb;
        }

        .tracking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .tracking-header h1 {
          margin: 0 0 6px;
          font-size: 2rem;
        }

        .tracking-header p {
          margin: 0;
          opacity: 0.7;
        }

        .tracking-refresh-button,
        .tracking-reset-filters {
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: inherit;
          border-radius: 8px;
          padding: 9px 14px;
          cursor: pointer;
        }

        .tracking-refresh-button:hover,
        .tracking-reset-filters:hover {
          background: rgba(255,255,255,0.12);
        }

        .tracking-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .tracking-summary-card {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 90px;
          padding: 18px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition: 0.2s ease;
        }

        .tracking-summary-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08);
        }

        .tracking-summary-card.active {
          border-color: rgba(255,180,50,0.8);
          box-shadow: 0 0 15px rgba(255,150,30,0.2);
        }

        .summary-icon {
          font-size: 2rem;
        }

        .summary-title {
          font-weight: 600;
        }

        .tracking-summary-card strong {
          font-size: 2rem;
        }

        .tracking-filters {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr) auto;
          gap: 10px;
          margin-bottom: 30px;
        }

        .tracking-filters input,
        .tracking-filters select {
          min-width: 0;
          padding: 11px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.25);
          color: inherit;
          outline: none;
        }

        .tracking-filters option {
          background: #222;
          color: white;
        }

        .tracking-section {
          margin-top: 10px;
        }

        .tracking-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .tracking-section-header h2 {
          margin: 0 0 5px;
        }

        .tracking-section-header p {
          margin: 0;
          opacity: 0.65;
        }

        .tracking-count {
          padding: 7px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          white-space: nowrap;
        }

        .tracking-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(260px, 1fr)
          );
          gap: 18px;
        }

        .tracking-card {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
          cursor: pointer;
          transition: transform 0.2s ease,
                      border-color 0.2s ease,
                      box-shadow 0.2s ease;
        }

        .tracking-card:hover {
          transform: translateY(-4px);
        }

        .tracking-card-researching {
          border-color: rgba(255,180,40,0.65);
          box-shadow: 0 0 15px rgba(255,150,20,0.12);
        }

        .tracking-card-researching:hover {
          border-color: rgba(255,180,40,1);
          box-shadow: 0 0 22px rgba(255,150,20,0.25);
        }

        .tracking-card-purchase {
          border-color: rgba(90,180,255,0.45);
        }

        .tracking-card-purchase:hover {
          border-color: rgba(90,180,255,0.9);
        }

        .tracking-card-unspaded {
          border-color: rgba(180,180,180,0.3);
        }

        .tracking-card-unspaded:hover {
          border-color: rgba(255,255,255,0.7);
        }

        .tracking-card-image-container {
          position: relative;
          height: 155px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.22);
          overflow: hidden;
        }

        .tracking-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
          box-sizing: border-box;
        }

        .tracking-status-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 5px 8px;
          border-radius: 5px;
          font-size: 0.7rem;
          font-weight: 700;
          backdrop-filter: blur(5px);
        }

        .researching-badge {
          background: rgba(255,145,0,0.85);
          color: #111;
        }

        .purchase-badge {
          background: rgba(50,150,230,0.85);
          color: white;
        }

        .unspaded-badge {
          background: rgba(90,90,90,0.85);
          color: white;
        }

        .tracking-card-content {
          padding: 14px;
        }

        .tracking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .tracking-card-header h3 {
          margin: 0;
          font-size: 1rem;
          line-height: 1.25;
        }

        .tracking-rank {
          flex-shrink: 0;
          font-size: 0.72rem;
          opacity: 0.6;
        }

        .tracking-card-meta {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          font-size: 0.78rem;
          opacity: 0.65;
        }

        .tracking-card-meta span + span::before {
          content: '•';
          margin-right: 8px;
        }

        .tracking-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 9px;
        }

        .tracking-tag {
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .premium-tag {
          background: rgba(255,190,40,0.15);
          color: #ffd05a;
        }

        .squadron-tag {
          background: rgba(80,170,255,0.15);
          color: #74bdff;
        }

        .event-tag {
          background: rgba(210,90,255,0.15);
          color: #d990ff;
        }

        .tracking-progress {
          margin-top: 14px;
        }

        .tracking-progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          margin-bottom: 5px;
        }

        .tracking-progress-info strong {
          font-size: 0.85rem;
        }

        .tracking-progress-bar {
          height: 7px;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
        }

        .tracking-progress-bar > div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #ff9d00,
            #ffd05a
          );
          transition: width 0.3s ease;
        }

        .tracking-progress-detail {
          margin-top: 5px;
          text-align: right;
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .tracking-purchase-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          font-size: 0.8rem;
        }

        .tracking-purchase-info strong {
          font-size: 0.85rem;
        }

        .tracking-empty {
          padding: 70px 20px;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 12px;
          background: rgba(255,255,255,0.025);
        }

        .tracking-empty > div {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .tracking-empty h3 {
          margin: 0 0 6px;
        }

        .tracking-empty p {
          margin: 0;
          opacity: 0.6;
        }

        @media (max-width: 900px) {
          .tracking-summary {
            grid-template-columns: 1fr;
          }

          .tracking-filters {
            grid-template-columns: 1fr 1fr;
          }

          .tracking-filters input {
            grid-column: 1 / -1;
          }

          .tracking-reset-filters {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .tracking-page {
            padding: 15px;
          }

          .tracking-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .tracking-filters {
            grid-template-columns: 1fr;
          }

          .tracking-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}