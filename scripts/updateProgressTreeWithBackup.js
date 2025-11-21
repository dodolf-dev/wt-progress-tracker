// scripts/updateProgressTreeWithBackup.js
const fs = require('fs');
const path = require('path');

class ProgressTreeUpdater {
  constructor() {
    this.progressTreePath = path.join(__dirname, '..','src', 'data', 'progressTree.js');
    this.serverResponsePath = path.join(__dirname, '..','src', 'data', 'server-response.json');
    this.backupPath = path.join(__dirname, '..','src', 'data', 'progressTree.backup.js');
    
    // Mapping des acronymes pour le formatage des noms de groupes
    this.acronyms = {
      'pby': 'PBY',
      'tbd': 'TBD', 
      'os2u': 'OS2U',
      'sb2u': 'SB2U',
      'tbf': 'TBF',
      'sbd': 'SBD',
      'p26': 'P-26',
      'p36': 'P-36',
      'p39': 'P-39',
      'p40': 'P-40',
      'p47': 'P-47',
      'p51': 'P-51',
      'p63': 'P-63',
      'p38': 'P-38',
      'bf2c': 'BF2C',
      'f2a': 'F2A',
      'f3f': 'F3F',
      'f4f': 'F4F',
      'f4u': 'F4U',
      'f6f': 'F6F',
      'b17': 'B-17',
      'b24': 'B-24',
      'b25': 'B-25',
      'b29': 'B-29',
      'a20': 'A-20',
      'a26': 'A-26',
      'yak': 'Yak'
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
    
    if (!match) {
      throw new Error('Format de progressTree.js invalide');
    }
    
    try {
      return eval('(' + match[1] + ')');
    } catch (error) {
      throw new Error('Erreur de parsing: ' + error.message);
    }
  }

  updateProgressTree(progressTree, serverData) {
    // Créer deux index séparés : un pour les véhicules normaux, un pour les groupes
    const vehicleMap = new Map();
    const groupMap = new Map();
    
    serverData.forEach(item => {
      if (item.vehicule_id) {
        // C'est un véhicule normal
        vehicleMap.set(item.vehicule_id, item);
      } else if (item.vehicule_group_id) {
        // C'est un groupe
        groupMap.set(item.vehicule_group_id, item);
      }
    });

    console.log(`🔍 Index créé avec ${vehicleMap.size} véhicules et ${groupMap.size} groupes`);

    let updatedCount = 0;
    let missingCount = 0;
    let groupCount = 0;

    Object.values(progressTree).forEach(category => {
      if (category.ranks) {
        category.ranks.forEach(rank => {
          if (rank.vehicles) {
            const result = this.updateVehicleGroup(rank.vehicles, vehicleMap, groupMap);
            updatedCount += result.updated;
            missingCount += result.missing;
            groupCount += result.groups;
          }
        });
      }
    });

    console.log(`📈 ${updatedCount} véhicules mis à jour, ${groupCount} groupes traités, ${missingCount} véhicules non trouvés`);
  }

  updateVehicleGroup(vehicles, vehicleMap, groupMap) {
    let updated = 0;
    let missing = 0;
    let groups = 0;

    Object.values(vehicles).forEach(vehicle => {
      // Vérifier si c'est un groupe (contient "_group" dans l'ID)
      const isGroup = vehicle.id && vehicle.id.includes('_group');
      
      if (isGroup) {
        groups++;
        
        // Pour les groupes, chercher dans groupMap
        if (groupMap.has(vehicle.id)) {
          const groupData = groupMap.get(vehicle.id);
          const groupName = this.formatGroupName(vehicle.id);
          
          vehicle.name = groupName;
          vehicle.image = groupData.vehicule_group_icon || "";
          
          console.log(`👥 Groupe trouvé: ${vehicle.id} -> ${groupName}`);
        } else {
          // Si le groupe n'est pas trouvé, utiliser le nom formaté
          const groupName = this.formatGroupName(vehicle.id);
          vehicle.name = groupName;
          vehicle.image = "";
          
          console.warn(`❓ Groupe non trouvé: ${vehicle.id}`);
          missing++;
        }
      } 
      // Véhicule normal (non-groupe)
      else if (vehicle.id && vehicle.id !== "") {
        if (vehicleMap.has(vehicle.id)) {
          const serverVehicle = vehicleMap.get(vehicle.id);
          vehicle.name = serverVehicle.vehicule_name || "";
          vehicle.image = serverVehicle.vehicule_icone || "";
          updated++;
        } else {
          console.warn(`❓ Véhicule non trouvé: ${vehicle.id}`);
          missing++;
        }
      }

      // Mettre à jour les enfants (pour les groupes et les véhicules normaux avec enfants)
      if (vehicle.children && Array.isArray(vehicle.children)) {
        vehicle.children.forEach(child => {
          if (child.id && child.id !== "") {
            if (vehicleMap.has(child.id)) {
              const serverChild = vehicleMap.get(child.id);
              child.name = serverChild.vehicule_name || "";
              child.image = serverChild.vehicule_icone || "";
              updated++;
            } else {
              console.warn(`❓ Véhicule enfant non trouvé: ${child.id}`);
              missing++;
            }
          }
        });
      }
    });

    return { updated, missing, groups };
  }

  // Fonction pour formater le nom des groupes
  formatGroupName(groupId) {
    // Enlever le suffixe "_group"
    let name = groupId.replace(/_group$/, '');
    
    // Remplacer les underscores par des espaces
    name = name.replace(/_/g, ' ');
    
    // Traitement spécial pour les modèles avec versions (ex: "yak-3up" -> "Yak-3UP")
    name = name.replace(/([a-zA-Z]+)-([0-9]+)([a-zA-Z]*)/g, (match, letters, numbers, suffix) => {
      const formattedLetters = letters.toUpperCase();
      const formattedSuffix = suffix ? suffix.toUpperCase() : '';
      return `${formattedLetters}-${numbers}${formattedSuffix}`;
    });
    
    // Appliquer les acronymes connus
    Object.entries(this.acronyms).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      name = name.replace(regex, value);
    });
    
    // Mettre en majuscule la première lettre de chaque mot qui n'est pas déjà en majuscule
    name = name.replace(/\b([a-z])([a-z]*)\b/g, (match, first, rest) => {
      // Ne pas modifier les mots qui contiennent déjà des majuscules
      if (match !== match.toLowerCase()) {
        return match;
      }
      return first.toUpperCase() + rest.toLowerCase();
    });
    
    return name;
  }

  saveProgressTree(progressTree) {
    const content = `export const progressTree = ${JSON.stringify(progressTree, null, 2)};`;
    fs.writeFileSync(this.progressTreePath, content, 'utf8');
    console.log('💾 Fichier progressTree.js sauvegardé');
  }
}

// Exécuter la mise à jour
const updater = new ProgressTreeUpdater();
updater.update();