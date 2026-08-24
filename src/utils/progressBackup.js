const STORAGE_KEY = 'wt-progress-tracker-progress';
const RESEARCHING_SESSION_KEY = 'wt-progress-tracker-researching';
const BACKUP_VERSION = 1;
const BACKUP_PREFIX = 'wt-progress-backup';

export const getStoredProgress = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Impossible de lire la progression locale.', error);
    throw new Error('La progression actuellement enregistrée est invalide.');
  }
};

export const getStoredResearchingVehicles = () => {
  try {
    const raw = sessionStorage.getItem(RESEARCHING_SESSION_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn(
      'Impossible de lire les véhicules actuellement recherchés depuis sessionStorage.',
      error
    );

    return {};
  }
};

export const exportProgress = () => {
  const progress = getStoredProgress();
  const researchingVehicles = getStoredResearchingVehicles();

  const backup = {
    app: 'wt-progress-tracker',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    researchingVehicles,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date();
  const dateString = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  const link = document.createElement('a');
  link.href = url;
  link.download = `${BACKUP_PREFIX}-${dateString}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const validateBackup = (backup) => {
  if (!backup || typeof backup !== 'object') {
    throw new Error('Le fichier n’est pas un objet JSON valide.');
  }

  if (backup.app !== 'wt-progress-tracker') {
    throw new Error(
      'Ce fichier ne semble pas être une sauvegarde de WT Progress Tracker.'
    );
  }

  if (backup.version !== BACKUP_VERSION) {
    throw new Error(
      `Version de sauvegarde incompatible : ${backup.version}.`
    );
  }

  if (
    !backup.progress ||
    typeof backup.progress !== 'object' ||
    Array.isArray(backup.progress)
  ) {
    throw new Error('La progression contenue dans la sauvegarde est invalide.');
  }

  // Compatible avec les anciennes sauvegardes qui ne possèdent
  // pas encore la propriété researchingVehicles.
  if (
    backup.researchingVehicles !== undefined &&
    (
      !backup.researchingVehicles ||
      typeof backup.researchingVehicles !== 'object' ||
      Array.isArray(backup.researchingVehicles)
    )
  ) {
    throw new Error(
      'Les véhicules actuellement recherchés contenus dans la sauvegarde sont invalides.'
    );
  }

  return true;
};

export const importProgress = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Aucun fichier sélectionné.'));
      return;
    }

    if (file.type && file.type !== 'application/json') {
      reject(new Error('Veuillez sélectionner un fichier JSON.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);

        validateBackup(backup);

        resolve(backup);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Impossible de lire cette sauvegarde.')
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Impossible de lire le fichier.'));
    };

    reader.readAsText(file);
  });
};

export const createSafetyBackup = () => {
  const progress = getStoredProgress();
  const researchingVehicles = getStoredResearchingVehicles();

  const backup = {
    app: 'wt-progress-tracker',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    researchingVehicles,
  };

  localStorage.setItem(
    `${STORAGE_KEY}-safety-backup`,
    JSON.stringify(backup)
  );

  return backup;
};

export const restoreProgress = (
  progress,
  researchingVehicles = {}
) => {
  if (
    !progress ||
    typeof progress !== 'object' ||
    Array.isArray(progress)
  ) {
    throw new Error('Les données de progression sont invalides.');
  }

  if (
    !researchingVehicles ||
    typeof researchingVehicles !== 'object' ||
    Array.isArray(researchingVehicles)
  ) {
    throw new Error(
      'Les données des véhicules actuellement recherchés sont invalides.'
    );
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(progress)
  );

  try {
    sessionStorage.setItem(
      RESEARCHING_SESSION_KEY,
      JSON.stringify(researchingVehicles)
    );
  } catch (error) {
    console.warn(
      'Impossible de restaurer les véhicules actuellement recherchés dans sessionStorage.',
      error
    );
  }
};

export { STORAGE_KEY };