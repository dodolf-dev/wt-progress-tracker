import { Link } from 'react-router-dom';

const colors = {
  background: '#0d1217',
  panel: '#151c23',
  panelHover: '#1b242d',
  border: '#303a44',
  gold: '#d6a84f',
  goldLight: '#f0c96a',
  text: '#e5e8eb',
  muted: '#9ca6af',
};

const cardStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',

  minHeight: '230px',
  padding: '28px',

  background: `
    linear-gradient(
      145deg,
      rgba(255,255,255,0.035),
      rgba(255,255,255,0.005)
    ),
    ${colors.panel}
  `,

  border: `1px solid ${colors.border}`,
  borderRadius: '4px',

  color: colors.text,
  textDecoration: 'none',

  overflow: 'hidden',

  boxSizing: 'border-box',

  transition:
    'transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
};

function ActionCard({ to, number, title, description, label }) {
  return (
    <Link
      to={to}
      style={cardStyle}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = 'translateY(-4px)';
        event.currentTarget.style.borderColor =
          'rgba(214, 168, 79, 0.65)';
        event.currentTarget.style.background = `
          linear-gradient(
            145deg,
            rgba(214,168,79,0.08),
            rgba(255,255,255,0.015)
          ),
          ${colors.panelHover}
        `;
        event.currentTarget.style.boxShadow =
          '0 12px 30px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = 'translateY(0)';
        event.currentTarget.style.borderColor = colors.border;
        event.currentTarget.style.background = `
          linear-gradient(
            145deg,
            rgba(255,255,255,0.035),
            rgba(255,255,255,0.005)
          ),
          ${colors.panel}
        `;
        event.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Décoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,

          width: '4px',
          height: '100%',

          background: colors.gold,

          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '18px',
          right: '22px',

          color: 'rgba(214, 168, 79, 0.18)',

          fontSize: '64px',
          fontWeight: '900',
          lineHeight: 1,

          userSelect: 'none',
        }}
      >
        {number}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,

          width: '55%',
          height: '1px',

          background: `
            linear-gradient(
              90deg,
              transparent,
              rgba(214,168,79,0.45)
            )
          `,
        }}
      />

      {/* Contenu */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            marginBottom: '10px',

            color: colors.gold,

            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>

        <h2
          style={{
            margin: '0 0 10px',

            color: colors.text,

            fontSize: '28px',
            fontWeight: '800',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            maxWidth: '420px',

            margin: '0 0 22px',

            color: colors.muted,

            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',

            color: colors.goldLight,

            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Accéder

          <span
            style={{
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - 82px)',

        padding: '50px 24px 70px',

        background: `
          radial-gradient(
            circle at 50% 0%,
            rgba(214,168,79,0.07),
            transparent 38%
          ),
          linear-gradient(
            rgba(255,255,255,0.018) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255,255,255,0.018) 1px,
            transparent 1px
          ),
          ${colors.background}
        `,

        backgroundSize:
          '100% 100%, 42px 42px, 42px 42px',

        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          margin: '0 auto',
        }}
      >
        {/* =========================================================
            HERO
        ========================================================= */}

        <section
          style={{
            position: 'relative',

            padding: '55px 45px 50px',

            marginBottom: '30px',

            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.035),
                rgba(255,255,255,0.008)
              ),
              ${colors.panel}
            `,

            border: `1px solid ${colors.border}`,
            borderRadius: '4px',

            overflow: 'hidden',

            boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
          }}
        >
          {/* Ligne dorée */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,

              width: '100%',
              height: '3px',

              background: `
                linear-gradient(
                  90deg,
                  transparent,
                  ${colors.gold},
                  transparent
                )
              `,
            }}
          />

          {/* Décoration */}
          <div
            style={{
              position: 'absolute',
              right: '-80px',
              bottom: '-140px',

              width: '400px',
              height: '400px',

              border: '1px solid rgba(214,168,79,0.08)',
              borderRadius: '50%',

              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',

              color: 'rgba(214,168,79,0.12)',

              fontSize: '80px',
              fontWeight: '900',
              letterSpacing: '-0.08em',

              userSelect: 'none',
            }}
          >
            WT
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                marginBottom: '12px',

                color: colors.gold,

                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              WAR THUNDER
            </div>

            <h1
              style={{
                margin: '0 0 14px',

                color: colors.text,

                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}
            >
              WT Progress Tracker
            </h1>

            <p
              style={{
                maxWidth: '680px',

                margin: 0,

                color: colors.muted,

                fontSize: '16px',
                lineHeight: 1.7,
              }}
            >
              Suivez votre progression dans War Thunder,
              consultez vos statistiques et gardez une vue
              d'ensemble de votre avancée.
            </p>
          </div>
        </section>

        {/* =========================================================
            SECTION NAVIGATION
        ========================================================= */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',

            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '22px',

              background: colors.gold,
            }}
          />

          <h2
            style={{
              margin: 0,

              color: colors.text,

              fontSize: '14px',
              fontWeight: '800',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Centre de commandement
          </h2>
        </div>

        {/* =========================================================
            CARTES
        ========================================================= */}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(300px, 1fr))',

            gap: '18px',
          }}
        >
          <ActionCard
            to="/progress"
            number="01"
            label="Arbre de progression"
            title="Progression"
            description="Explorez les véhicules disponibles et suivez votre progression à travers les différentes nations et rangs."
          />

          <ActionCard
            to="/stat"
            number="02"
            label="Vue d'ensemble"
            title="Statistiques"
            description="Consultez vos statistiques et obtenez une vision claire de votre progression dans le jeu."
          />
        </section>

        {/* =========================================================
            FOOTER HOME
        ========================================================= */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            gap: '14px',

            marginTop: '42px',

            color: '#68737d',

            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '35px',
              height: '1px',
              background: colors.border,
            }}
          />

          WT PROGRESS TRACKER

          <span
            style={{
              width: '35px',
              height: '1px',
              background: colors.border,
            }}
          />
        </div>
      </div>
    </main>
  );
}