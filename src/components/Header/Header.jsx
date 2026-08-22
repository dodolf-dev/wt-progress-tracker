// src/components/Header/Header.jsx

import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  exportProgress,
  importProgress,
  createSafetyBackup,
  restoreProgress,
} from '../../utils/progressBackup';

const COLORS = {
  bg: '#151a20',
  bgDark: '#101419',
  panel: '#1b222a',
  panelHover: '#242d36',
  border: '#343d46',
  borderLight: '#46515c',
  text: '#e4e7ea',
  textMuted: '#9ba5ae',
  gold: '#d6a84f',
  goldLight: '#f0c96a',
  red: '#b94a48',
  redLight: '#e37a76',
};

const Header = () => {
  const fileInputRef = useRef(null);

  const [showDataMenu, setShowDataMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedBackup, setImportedBackup] = useState(null);
  const [importError, setImportError] = useState('');

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '38px',
    padding: '0 18px',

    background: isActive
      ? `linear-gradient(
          180deg,
          rgba(214, 168, 79, 0.22) 0%,
          rgba(214, 168, 79, 0.08) 100%
        )`
      : 'transparent',

    color: isActive ? COLORS.goldLight : COLORS.textMuted,

    border: `1px solid ${
      isActive ? 'rgba(214, 168, 79, 0.65)' : 'transparent'
    }`,

    borderRadius: '3px',

    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: isActive ? '700' : '600',
    letterSpacing: '0.03em',
    textDecoration: 'none',
    textTransform: 'uppercase',

    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  });

  const buttonStyle = {
    minHeight: '38px',
    padding: '0 14px',

    background: `linear-gradient(
      180deg,
      ${COLORS.panel} 0%,
      ${COLORS.bgDark} 100%
    )`,

    color: COLORS.textMuted,

    border: `1px solid ${COLORS.border}`,
    borderRadius: '3px',

    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.03em',

    transition: 'all 0.15s ease',
  };

  const handleResetAllData = () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION\n\n' +
        'Cette action va supprimer toute votre progression, ' +
        'vos achats et les données sauvegardées localement.\n\n' +
        'Cette action est irréversible.\n\n' +
        'Voulez-vous vraiment continuer ?'
    );

    if (!confirmed) {
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    window.location.reload();
  };

  const handleExportProgress = () => {
    try {
      exportProgress();
      setShowDataMenu(false);
    } catch (error) {
      window.alert(
        `Impossible d'exporter la progression.\n\n${error.message}`
      );
    }
  };

  const handleImportClick = () => {
    setImportError('');
    fileInputRef.current?.click();
  };

  const handleImportProgress = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImportError('');

    try {
      const backup = await importProgress(file);

      setImportedBackup(backup);
      setShowImportModal(true);
      setShowDataMenu(false);
    } catch (error) {
      setImportError(error.message);
    } finally {
      // Permet de sélectionner à nouveau le même fichier
      event.target.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!importedBackup) {
      return;
    }

    try {
      // Sauvegarde de sécurité de la progression actuelle
      createSafetyBackup();

      // Remplacement par la progression importée
      restoreProgress(importedBackup.progress);

      setShowImportModal(false);
      setImportedBackup(null);

      // Recharge l'application
      window.location.reload();
    } catch (error) {
      setImportError(
        `Impossible d'importer la progression.\n\n${error.message}`
      );
    }
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setImportedBackup(null);
    setImportError('');
  };

  const formatImportDate = (date) => {
    if (!date) {
      return 'Date inconnue';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date inconnue';
    }

    return parsedDate.toLocaleString('fr-FR');
  };

  return (
    <>
      {/* ============================================================
          HEADER
      ============================================================ */}

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,

          width: '100%',
          boxSizing: 'border-box',

          background: `
            linear-gradient(
              180deg,
              ${COLORS.bg} 0%,
              ${COLORS.bgDark} 100%
            )
          `,

          borderBottom: `1px solid ${COLORS.border}`,

          boxShadow:
            '0 3px 12px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(214, 168, 79, 0.08)',

          color: COLORS.text,
        }}
      >
        {/* Ligne décorative supérieure */}
        <div
          style={{
            height: '2px',
            width: '100%',
            background: `
              linear-gradient(
                90deg,
                transparent 0%,
                rgba(214, 168, 79, 0.35) 25%,
                ${COLORS.gold} 50%,
                rgba(214, 168, 79, 0.35) 75%,
                transparent 100%
              )
            `,
          }}
        />

        <div
          style={{
            width: '100%',
            maxWidth: '1500px',
            minHeight: '62px',

            margin: '0 auto',
            padding: '8px 18px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            gap: '18px',
            boxSizing: 'border-box',
          }}
        >
          {/* ========================================================
              LOGO
          ======================================================== */}

          <div
            style={{
              flex: '1 1 0',
              minWidth: 0,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <NavLink
              to="/"
              end
              aria-label="WT Progress Tracker - Accueil"
              style={{
                display: 'flex',
                alignItems: 'center',

                padding: '3px 6px',

                textDecoration: 'none',

                borderRadius: '3px',

                transition: 'opacity 0.15s ease',
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/img/icons/logoWT_stripe_flat.png`}
                alt="WT Progress Tracker"
                style={{
                  display: 'block',

                  height: '42px',
                  width: 'auto',
                  maxWidth: '210px',

                  objectFit: 'contain',
                }}
              />
            </NavLink>
          </div>

          {/* ========================================================
              NAVIGATION
          ======================================================== */}

          <nav
            aria-label="Navigation principale"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',

              padding: '4px',

              background: 'transparent',

              flexShrink: 0,
            }}
          >
            <NavLink to="/" end style={linkStyle}>
              Accueil
            </NavLink>

            <NavLink to="/stat" style={linkStyle}>
              Statistiques
            </NavLink>

            <NavLink to="/progress" style={linkStyle}>
              Progression
            </NavLink>
          </nav>

          {/* ========================================================
              ACTIONS
          ======================================================== */}

          <div
            style={{
              flex: '1 1 0',
              minWidth: 0,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',

              gap: '8px',

              position: 'relative',
            }}
          >
            {/* ------------------------------------------------------
                MENU DONNÉES
            ------------------------------------------------------ */}

            <div
              style={{
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDataMenu(!showDataMenu);
                  setImportError('');
                }}
                style={{
                  ...buttonStyle,

                  color: showDataMenu
                    ? COLORS.goldLight
                    : COLORS.textMuted,

                  borderColor: showDataMenu
                    ? 'rgba(214, 168, 79, 0.55)'
                    : COLORS.border,
                }}
                title="Gérer les données"
              >
                Données
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '10px',
                    color: showDataMenu
                      ? COLORS.gold
                      : COLORS.textMuted,
                  }}
                >
                  {showDataMenu ? '▲' : '▼'}
                </span>
              </button>

              {/* ----------------------------------------------------
                  DROPDOWN
              ---------------------------------------------------- */}

              {showDataMenu && (
                <div
                  style={{
                    position: 'absolute',

                    top: 'calc(100% + 7px)',
                    right: 0,

                    minWidth: '240px',

                    padding: '5px',

                    background: `
                      linear-gradient(
                        180deg,
                        ${COLORS.panel} 0%,
                        ${COLORS.bgDark} 100%
                      )
                    `,

                    border: `1px solid ${COLORS.borderLight}`,
                    borderRadius: '4px',

                    boxShadow:
                      '0 8px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',

                    zIndex: 1100,
                  }}
                >
                  <div
                    style={{
                      padding: '7px 10px 6px',

                      color: COLORS.gold,
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',

                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    Gestion des données
                  </div>

                  <button
                    type="button"
                    onClick={handleExportProgress}
                    style={{
                      display: 'block',
                      width: '100%',

                      padding: '11px 10px',

                      background: 'transparent',
                      color: COLORS.text,

                      border: 'none',
                      borderRadius: '2px',

                      cursor: 'pointer',
                      textAlign: 'left',

                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: '600',

                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        color: COLORS.gold,
                      }}
                    >
                      ↓
                    </span>

                    Exporter la progression
                  </button>

                  <button
                    type="button"
                    onClick={handleImportClick}
                    style={{
                      display: 'block',
                      width: '100%',

                      padding: '11px 10px',

                      background: 'transparent',
                      color: COLORS.text,

                      border: 'none',
                      borderRadius: '2px',

                      cursor: 'pointer',
                      textAlign: 'left',

                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: '600',

                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        color: COLORS.gold,
                      }}
                    >
                      ↑
                    </span>

                    Importer une progression
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportProgress}
                style={{
                  display: 'none',
                }}
              />
            </div>

            {/* ------------------------------------------------------
                RESET
            ------------------------------------------------------ */}

            <button
              type="button"
              onClick={handleResetAllData}
              style={{
                ...buttonStyle,

                background: `
                  linear-gradient(
                    180deg,
                    rgba(155, 58, 55, 0.20),
                    rgba(91, 35, 34, 0.15)
                  )
                `,

                color: COLORS.redLight,

                borderColor: 'rgba(185, 74, 72, 0.45)',
              }}
              title="Effacer toutes les données (progression, achats, interface)"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          MODAL D'IMPORT
      ============================================================ */}

      {showImportModal && importedBackup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,

            zIndex: 2000,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: 'rgba(0, 0, 0, 0.72)',

            padding: '20px',

            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',

              background: `
                linear-gradient(
                  180deg,
                  ${COLORS.panel} 0%,
                  ${COLORS.bgDark} 100%
                )
              `,

              color: COLORS.text,

              border: `1px solid ${COLORS.borderLight}`,
              borderTop: `2px solid ${COLORS.gold}`,
              borderRadius: '4px',

              boxShadow:
                '0 15px 50px rgba(0,0,0,0.65)',

              padding: '24px',

              boxSizing: 'border-box',
            }}
          >
            <h2
              style={{
                margin: '0 0 20px',

                color: COLORS.goldLight,

                fontSize: '20px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Importer une progression
            </h2>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.22)',

                border: `1px solid ${COLORS.border}`,
                borderRadius: '3px',

                padding: '14px',
                marginBottom: '16px',
              }}
            >
              <div style={{ marginBottom: '9px' }}>
                <strong>Application :</strong>{' '}
                {importedBackup.app}
              </div>

              <div style={{ marginBottom: '9px' }}>
                <strong>Version :</strong>{' '}
                {importedBackup.version}
              </div>

              <div>
                <strong>Exportée le :</strong>{' '}
                {formatImportDate(importedBackup.exportedAt)}
              </div>
            </div>

            <div
              style={{
                padding: '13px',

                background: 'rgba(214, 168, 79, 0.09)',

                border: '1px solid rgba(214, 168, 79, 0.38)',
                borderRadius: '3px',

                marginBottom: '20px',

                color: '#d9c48f',
              }}
            >
              <strong
                style={{
                  color: COLORS.goldLight,
                }}
              >
                ⚠️ Attention
              </strong>

              <p
                style={{
                  marginBottom: 0,
                  marginTop: '9px',
                  lineHeight: '1.5',
                }}
              >
                Cette opération va remplacer votre progression
                actuelle.
              </p>

              <p
                style={{
                  marginBottom: 0,
                  lineHeight: '1.5',
                }}
              >
                Une sauvegarde de sécurité de votre progression
                actuelle sera créée automatiquement avant
                l'importation.
              </p>
            </div>

            {importError && (
              <div
                style={{
                  padding: '11px',
                  marginBottom: '16px',

                  background: 'rgba(185, 74, 72, 0.12)',

                  color: COLORS.redLight,

                  border: '1px solid rgba(185, 74, 72, 0.4)',
                  borderRadius: '3px',
                }}
              >
                {importError}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',

                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={handleCancelImport}
                style={{
                  ...buttonStyle,
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                style={{
                  minHeight: '38px',
                  padding: '0 18px',

                  background: `
                    linear-gradient(
                      180deg,
                      #d6a84f 0%,
                      #a97d2d 100%
                    )
                  `,

                  color: '#171b20',

                  border: '1px solid #e2bd6b',
                  borderRadius: '3px',

                  cursor: 'pointer',

                  fontFamily: 'inherit',
                  fontSize: '13px',
                  fontWeight: '800',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',

                  boxShadow:
                    '0 2px 6px rgba(0,0,0,0.25)',
                }}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;