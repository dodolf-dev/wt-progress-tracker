// scripts/updateProgressTreeWithBackup.js
const fs = require('fs');
const path = require('path');

class ProgressTreeUpdater {
  constructor() {
    this.progressTreePath = path.join(__dirname, '..', 'src', 'data', 'progressTree.js');
    this.serverResponsePath = path.join(__dirname, '..', 'src', 'data', 'server-response.json');
    this.backupPath = path.join(__dirname, '..', 'src', 'data', 'progressTree.backup.js');

    this.acronyms = {
      'pby': 'PBY', 'tbd': 'TBD', 'os2u': 'OS2U', 'sb2u': 'SB2U', 'tbf': 'TBF',
      'sbd': 'SBD', 'p26': 'P-26', 'p36': 'P-36', 'p39': 'P-39', 'p40': 'P-40',
      'p47': 'P-47', 'p51': 'P-51', 'p63': 'P-63', 'p38': 'P-38', 'bf2c': 'BF2C',
      'f2a': 'F2A', 'f3f': 'F3F', 'f4f': 'F4F', 'f4u': 'F4U', 'f6f': 'F6F',
      'b17': 'B-17', 'b24': 'B-24', 'b25': 'B-25', 'b29': 'B-29', 'a20': 'A-20',
      'a26': 'A-26', 'yak': 'Yak'
    };
  }

  async update() {
    try {
      console.log('🔄 Début de la mise à jour de progressTree...');
      await this.createBackup();
      const serverData = await this.loadServerData();
      const progressTree = await this.loadProgressTree();
      this.updateProgressTree(progressTree, serverData);
      await this.saveProgressTree(progressTree);
      console.log('✅ progressTree.js mis à jour avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error.message);
      await this.restoreBackup();
      process.exit(1);
    }
  }

  async createBackup() {
    if (fs.existsSync(this.progressTreePath)) {
      const content = fs.readFileSync(this.progressTreePath, 'utf8');
      fs.writeFileSync(this.backupPath, content, 'utf8');
      console.log('📦 Sauvegarde créée');
    }
  }

  async restoreBackup() {
    if (fs.existsSync(this.backupPath)) {
      const content = fs.readFileSync(this.backupPath, 'utf8');
      fs.writeFileSync(this.progressTreePath, content, 'utf8');
      console.log('🔄 Sauvegarde restaurée');
    }
  }

  loadServerData() {
    if (!fs.existsSync(this.serverResponsePath)) {
      throw new Error(`Fichier non trouvé: ${this.serverResponsePath}`);
    }
    const content = fs.readFileSync(this.serverResponsePath, 'utf8');
    const data = JSON.parse(content);
    if (!Array.isArray(data)) {
      throw new Error('server-response.json doit contenir un tableau de véhicules');
    }
    return data;
  }

  loadProgressTree() {
    if (!fs.existsSync(this.progressTreePath)) {
      throw new Error(`Fichier non trouvé: ${this.progressTreePath}`);
    }
    const content = fs.readFileSync(this.progressTreePath, 'utf8');
    const match = content.match(/export const progressTree = ({[\s\S]*});/);
    if (!match) throw new Error('Format de progressTree.js invalide');
    try {
      return eval('(' + match[1] + ')');
    } catch (error) {
      throw new Error('Erreur de parsing: ' + error.message);
    }
  }

  updateProgressTree(progressTree, serverData) {
    const vehicleMap = new Map();
    const groupMap = new Map();

    serverData.forEach(item => {
      if (item.vehicule_id) vehicleMap.set(item.vehicule_id, item);
      else if (item.vehicule_group_id) groupMap.set(item.vehicule_group_id, item);
    });

    console.log(`🔍 Index créé avec ${vehicleMap.size} véhicules et ${groupMap.size} groupes`);

    let updatedCount = 0, missingCount = 0, groupCount = 0;

    Object.values(progressTree).forEach(category => {
      if (category.ranks) {
        category.ranks.forEach(rank => {
          if (rank.vehicles) {
            const res = this.updateVehicleGroup(rank.vehicles, vehicleMap, groupMap);
            updatedCount += res.updated;
            missingCount += res.missing;
            groupCount += res.groups;
          }
        });
      }
    });

    console.log(`📈 ${updatedCount} véhicules mis à jour, ${groupCount} groupes traités, ${missingCount} véhicules non trouvés`);
  }

  // Helper : générer une grille par défaut à 2 colonnes
  generateDefaultGrid(length) {
    const COLS = 2;
    const grid = [];
    for (let i = 0; i < length; i++) {
      const row = Math.floor(i / COLS);
      if (!grid[row]) grid[row] = [];
      grid[row].push(1);
    }
    const lastRow = grid[grid.length - 1];
    if (lastRow) {
      while (lastRow.length < COLS) lastRow.push(0);
    }
    return grid;
  }

  buildModifications(apiVehicleData, existingModifications = null) {
    const apiGroups = apiVehicleData.modifications_by_group;
    if (!apiGroups) return null;

    const existingCategories = existingModifications?.categories || {};
    const newCategories = {};

    for (const [categoryName, existingCat] of Object.entries(existingCategories)) {
      const apiModsArray = apiGroups[categoryName] ?? null;
      if (!apiModsArray || apiModsArray.length === 0) {
        // Garder la catégorie existante telle quelle (même si invalide)
        newCategories[categoryName] = existingCat;
        continue;
      }

      let grid, mods;
      // Vérifier que existingCat est un objet avec une grille valide
      if (typeof existingCat === 'object' && existingCat !== null && Array.isArray(existingCat.grid)) {
        grid = existingCat.grid;
        if (grid.length === 0) {
          grid = this.generateDefaultGrid(apiModsArray.length);
        }
        mods = existingCat.mods || {};
      } else {
        // Structure invalide (ex: string), on la remplace par un objet propre
        grid = this.generateDefaultGrid(apiModsArray.length);
        mods = {};
      }

      let apiIndex = 0;
      const newMods = {};

      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === 1) {
            const modKey = String(apiIndex + 1);
            if (apiIndex < apiModsArray.length) {
              const apiMod = apiModsArray[apiIndex];
              newMods[modKey] = {
                id: mods[modKey]?.id || `mod_${categoryName.replace(/\s+/g, '_')}_${apiIndex + 1}`,
                name: apiMod.name,
                image: apiMod.image_url || '',
                rp_cost: parseInt(apiMod.rp_cost, 10) || 0,
                sl_cost: parseInt(apiMod.sl_cost, 10) || 0,
                progress: mods[modKey]?.progress ?? 0
              };
            } else {
              if (mods[modKey]) {
                newMods[modKey] = mods[modKey];
              }
            }
            apiIndex++;
          }
        }
      }

      newCategories[categoryName] = { grid, mods: newMods };
    }

    // Nouveaux groupes de l'API
    for (const [groupName, modsArray] of Object.entries(apiGroups)) {
      if (!(groupName in newCategories) && modsArray.length > 0) {
        const grid = this.generateDefaultGrid(modsArray.length);
        const mods = {};
        modsArray.forEach((apiMod, idx) => {
          const modKey = String(idx + 1);
          mods[modKey] = {
            id: `mod_${groupName.replace(/\s+/g, '_')}_${idx + 1}`,
            name: apiMod.name,
            image: apiMod.image_url || '',
            rp_cost: parseInt(apiMod.rp_cost, 10) || 0,
            sl_cost: parseInt(apiMod.sl_cost, 10) || 0,
            progress: 0
          };
        });
        newCategories[groupName] = { grid, mods };
        console.log(`🆕 Nouvelle catégorie "${groupName}" ajoutée`);
      }
    }

    return {
      categories: newCategories,
      availableRP: existingModifications?.availableRP ?? 0,
      researchedMods: existingModifications?.researchedMods ?? []
    };
  }

  updateVehicleGroup(vehicles, vehicleMap, groupMap) {
    let updated = 0, missing = 0, groups = 0;

    Object.values(vehicles).forEach(vehicle => {
      const isGroup = vehicle.id?.includes('_group');

      if (isGroup) {
        groups++;
        if (groupMap.has(vehicle.id)) {
          vehicle.name = this.formatGroupName(vehicle.id);
          vehicle.image = groupMap.get(vehicle.id).vehicule_group_icon || '';
        } else {
          vehicle.name = this.formatGroupName(vehicle.id);
          vehicle.image = '';
          missing++;
        }
      } else if (vehicle.id && vehicle.id !== '') {
        if (vehicleMap.has(vehicle.id)) {
          const sv = vehicleMap.get(vehicle.id);
          vehicle.name = sv.vehicule_name || '';
          vehicle.image = sv.vehicule_icone || '';

          vehicle.premium = !!sv.vehicule_premium;
          vehicle.squadron = !!sv.squadron_vehicule;
          vehicle.event = !!sv.event_vehicule;

          const geCost = sv.purchase?.purchase_cost_ge || sv.purchase_cost_ge;
          if (geCost) vehicle.ge_cost = parseInt(geCost, 10);

          if (sv.modifications_by_group) {
            vehicle.modifications = this.buildModifications(sv, vehicle.modifications);
          }
          updated++;
        } else {
          missing++;
        }
      }

      if (vehicle.children) {
        vehicle.children.forEach(child => {
          if (child.id && child.id !== '' && vehicleMap.has(child.id)) {
            const sc = vehicleMap.get(child.id);
            child.name = sc.vehicule_name || '';
            child.image = sc.vehicule_icone || '';

            child.premium = !!sc.vehicule_premium;
            child.squadron = !!sc.squadron_vehicule;
            child.event = !!sc.event_vehicule;

            const geCost = sc.purchase?.purchase_cost_ge || sc.purchase_cost_ge;
            if (geCost) child.ge_cost = parseInt(geCost, 10);

            updated++;
          }
        });
      }
    });

    return { updated, missing, groups };
  }

  formatGroupName(groupId) {
    let name = groupId.replace(/_group$/, '');
    name = name.replace(/_/g, ' ');
    name = name.replace(/([a-zA-Z]+)-([0-9]+)([a-zA-Z]*)/g, (_, l, n, s) =>
      `${l.toUpperCase()}-${n}${s.toUpperCase()}`
    );
    Object.entries(this.acronyms).forEach(([k, v]) => {
      name = name.replace(new RegExp(`\\b${k}\\b`, 'gi'), v);
    });
    name = name.replace(/\b([a-z])([a-z]*)\b/g, (m, first, rest) =>
      m !== m.toLowerCase() ? m : first.toUpperCase() + rest.toLowerCase()
    );
    return name;
  }

  saveProgressTree(progressTree) {
    const content = `export const progressTree = ${JSON.stringify(progressTree, null, 2)};`;
    fs.writeFileSync(this.progressTreePath, content, 'utf8');
    console.log('💾 Fichier progressTree.js sauvegardé');
  }
}

const updater = new ProgressTreeUpdater();
updater.update();