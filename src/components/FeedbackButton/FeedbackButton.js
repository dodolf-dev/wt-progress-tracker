import React, { useState } from 'react';

const GITHUB_ISSUES_URL = 'https://github.com/dodolf-dev/wt-progress-tracker/issues/new';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const typeLabel =
      type === 'bug'
        ? '🐛 Bug'
        : '💡 Amélioration';

    const issueTitle =
      title.trim() ||
      (type === 'bug'
        ? '🐛 Nouveau problème'
        : '💡 Suggestion d’amélioration');

    const body = `## ${typeLabel}

${message.trim()}

---

Date : ${new Date().toLocaleString('fr-FR')}
`;

    const params = new URLSearchParams({
      title: issueTitle,
      body,
    });

    window.open(
      `${GITHUB_ISSUES_URL}?${params.toString()}`,
      '_blank',
      'noopener,noreferrer'
    );

    setMessage('');
    setTitle('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="feedback-floating-button"
        onClick={() => setIsOpen(true)}
        title="Signaler un problème ou suggérer une amélioration"
      >
        💬
      </button>

      {isOpen && (
        <div
          className="feedback-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="feedback-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="feedback-header">
              <div>
                <h2>Feedback</h2>
                <p>
                  Un problème ou une idée ? Dis-nous tout.
                </p>
              </div>

              <button
                className="feedback-close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="feedback-type">
              <button
                type="button"
                className={type === 'bug' ? 'active' : ''}
                onClick={() => setType('bug')}
              >
                🐛 Problème
              </button>

              <button
                type="button"
                className={type === 'feature' ? 'active' : ''}
                onClick={() => setType('feature')}
              >
                💡 Amélioration
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Titre

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? 'Ex : Les véhicules disponibles apparaissent en recherche'
                      : 'Ex : Ajouter un filtre par nation'
                  }
                />
              </label>

              <label>
                Description

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? 'Décris ce qui ne fonctionne pas...'
                      : 'Décris ton idée ou ton amélioration...'
                  }
                  rows={6}
                  required
                />
              </label>
              <button
                type="submit"
                className="feedback-submit"
              >
                Continuer vers GitHub →
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .feedback-floating-button {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          background: rgba(25,25,25,0.95);
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
          z-index: 9998;
          box-shadow: 0 5px 20px rgba(0,0,0,0.35);
          transition: 0.2s ease;
        }

        .feedback-floating-button:hover {
          transform: scale(1.08);
          background: rgba(45,45,45,0.98);
        }

        .feedback-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
        }

        .feedback-modal {
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          background: #171717;
          color: #e5e7eb;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .feedback-header h2 {
          margin: 0 0 5px;
        }

        .feedback-header p {
          margin: 0;
          opacity: 0.65;
          font-size: 0.9rem;
        }

        .feedback-close {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .feedback-type {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .feedback-type button {
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          color: inherit;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .feedback-type button.active {
          border-color: rgba(255,170,50,0.8);
          background: rgba(255,170,50,0.12);
        }

        .feedback-modal form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feedback-modal label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 0.85rem;
          font-weight: 300;
        }

        .feedback-modal input,
        .feedback-modal textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 8px;
          background: rgba(0,0,0,0.25);
          color: white;
          font: inherit;
          outline: none;
          resize: vertical;
        }

        .feedback-modal input:focus,
        .feedback-modal textarea:focus {
          border-color: rgba(255,170,50,0.7);
        }

        .feedback-info {
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          font-size: 0.75rem;
          opacity: 0.6;
          line-height: 1.4;
        }

        .feedback-submit {
          padding: 12px 16px;
          border: 0;
          border-radius: 9px;
          background: #e89422;
          color: #111;
          font-weight: 700;
          cursor: pointer;
        }

        .feedback-submit:hover {
          filter: brightness(1.08);
        }

        @media (max-width: 600px) {
          .feedback-overlay {
            padding: 12px;
          }

          .feedback-modal {
            padding: 18px;
          }

          .feedback-type {
            grid-template-columns: 1fr;
          }

          .feedback-floating-button {
            right: 15px;
            bottom: 15px;
          }
        }
      `}</style>
    </>
  );
}