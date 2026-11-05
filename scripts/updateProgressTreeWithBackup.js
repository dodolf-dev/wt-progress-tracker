// scripts/updateProgressTreeWithBackup.js
const fs = require('fs');
const path = require('path');

class ProgressTreeUpdater {
  constructor() {
    this.progressTreePath = path.join(
      __dirname,
      '..',
      'src',
      'data',
      'progressTree.js'
    );

    this.serverResponsePath = path.join(
      __dirname,
      '..',
      'src',
      'data',
      'server-response.json'
    );

    this.acronyms = {
      pby: 'PBY',
      tbd: 'TBD',
      os2u: 'OS2U',
      sb2u: 'SB2U',
      tbf: 'TBF',
      sbd: 'SBD',
      p26: 'P-26',
      p36: 'P-36',
      p39: 'P-39',
      p40: 'P-40',
      p47: 'P-47',
      p51: 'P-51',
      p63: 'P-63',
      p38: 'P-38',
      bf2c: 'BF2C',
      f2a: 'F2A',
      f3f: 'F3F',
      f4f: 'F4F',
      f4u: 'F4U',
      f6f: 'F6F',
      b17: 'B-17',
      b24: 'B-24',
      b25: 'B-25',
      b29: 'B-29',
      a20: 'A-20',
      a26: 'A-26',
      yak: 'Yak'
    };
  }

  async update() {
    try {
      console.log('🔄 Début de la mise à jour de progressTree...');

      const serverData = await this.loadServerData();
      const progressTree = await this.loadProgressTree();

      this.updateProgressTree(progressTree, serverData);

      await this.saveProgressTree(progressTree);

      console.log('✅ progressTree.js mis à jour avec succès !');
    } catch (error) {
      console.error(
        '❌ Erreur lors de la mise à jour:',
        error.message
      );

      process.exit(1);
    }
  }

  loadServerData() {
    if (!fs.existsSync(this.serverResponsePath)) {
      throw new Error(
        `Fichier non trouvé: ${this.serverResponsePath}`
      );
    }

    const content = fs.readFileSync(
      this.serverResponsePath,
      'utf8'
    );

    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      throw new Error(
        'server-response.json doit contenir un tableau de véhicules'
      );
    }

    return data;
  }

  loadProgressTree() {
    if (!fs.existsSync(this.progressTreePath)) {
      throw new Error(
        `Fichier non trouvé: ${this.progressTreePath}`
      );
    }

    const content = fs.readFileSync(
      this.progressTreePath,
      'utf8'
    );

    const match = content.match(
      /export const progressTree = ({[\s\S]*});/
    );

    if (!match) {
      throw new Error(
        'Format de progressTree.js invalide'
      );
    }

    try {
      return eval('(' + match[1] + ')');
    } catch (error) {
      throw new Error(
        'Erreur de parsing: ' + error.message
      );
    }
  }

  updateProgressTree(progressTree, serverData) {
    const vehicleMap = new Map();
    const groupMap = new Map();

    // ==================================================
    // INDEX SERVEUR
    // ==================================================

    serverData.forEach(item => {
      if (item.vehicule_id) {
        vehicleMap.set(
          item.vehicule_id,
          item
        );
      }

      if (item.vehicule_group_id) {
        groupMap.set(
          item.vehicule_group_id,
          item
        );
      }
    });

    console.log(
      `🔍 Index créé avec ${vehicleMap.size} véhicules et ${groupMap.size} groupes`
    );

    let updatedCount = 0;
    let missingCount = 0;
    let groupCount = 0;

    const missingVehicleIds = [];

    // ==================================================
    // PARCOURS DE L'ARBRE
    // ==================================================

    Object.values(progressTree).forEach(category => {
      if (category.ranks) {
        category.ranks.forEach(rank => {
          if (rank.vehicles) {
            const res = this.updateVehicleGroup(
              rank.vehicles,
              vehicleMap,
              groupMap,
              missingVehicleIds
            );

            updatedCount += res.updated;
            missingCount += res.missing;
            groupCount += res.groups;
          }
        });
      }
    });

    console.log(
      `📈 ${updatedCount} véhicules mis à jour, ` +
      `${groupCount} groupes traités, ` +
      `${missingCount} véhicules non trouvés`
    );

    // ==================================================
    // AFFICHAGE DES VÉHICULES NON TROUVÉS
    // ==================================================

    if (missingVehicleIds.length > 0) {
      const missingCounts =
        missingVehicleIds.reduce(
          (counts, id) => {
            counts[id] = (counts[id] || 0) + 1;
            return counts;
          },
          {}
        );

      const uniqueMissingVehicleIds =
        Object.keys(missingCounts);

      console.log('');
      console.log(
        `❌ ${missingVehicleIds.length} occurrences de véhicules non trouvés`
      );

      console.log(
        `❌ ${uniqueMissingVehicleIds.length} IDs uniques non trouvés`
      );

      console.log('');
      console.log('📋 LISTE COMPLÈTE DES VÉHICULES NON TROUVÉS :');

      missingVehicleIds.forEach((id, index) => {
        console.log(
          `   ${index + 1}. ${id}`
        );
      });

      const duplicateMissingIds =
        Object.entries(missingCounts)
          .filter(([, count]) => count > 1);

      console.log('');

      if (duplicateMissingIds.length > 0) {
        console.log(
          `🔁 DOUBLONS (${duplicateMissingIds.length} IDs) :`
        );

        duplicateMissingIds.forEach(
          ([id, count], index) => {
            console.log(
              `   ${index + 1}. ${id} — ${count} occurrences`
            );
          }
        );
      } else {
        console.log(
          '🔁 Aucun doublon trouvé.'
        );
      }
    }
  }

  generateDefaultGrid(length) {
    const COLS = 2;
    const grid = [];

    for (let i = 0; i < length; i++) {
      const row = Math.floor(i / COLS);

      if (!grid[row]) {
        grid[row] = [];
      }

      grid[row].push(1);
    }

    const lastRow =
      grid[grid.length - 1];

    if (lastRow) {
      while (lastRow.length < COLS) {
        lastRow.push(0);
      }
    }

    return grid;
  }

  buildModifications(
    apiVehicleData,
    existingModifications = null
  ) {
    const apiGroups =
      apiVehicleData.modifications_by_group;

    if (!apiGroups) {
      return existingModifications || null;
    }

    const existingCategories =
      existingModifications?.categories || {};

    const serverCategories =
      apiVehicleData.modifications?.categories || {};

    const newCategories = {};

    for (const [
      categoryName,
      apiModsArray
    ] of Object.entries(apiGroups)) {
      if (
        !Array.isArray(apiModsArray) ||
        apiModsArray.length === 0
      ) {
        if (existingCategories[categoryName]) {
          newCategories[categoryName] =
            existingCategories[categoryName];
        }

        continue;
      }

      const existingCat =
        existingCategories[categoryName];

      const serverCat =
        serverCategories[categoryName];

      let grid;

      if (
        serverCat &&
        typeof serverCat === 'object' &&
        Array.isArray(serverCat.grid) &&
        serverCat.grid.length > 0
      ) {
        grid = serverCat.grid.map(
          row => [...row]
        );
      } else if (
        existingCat &&
        typeof existingCat === 'object' &&
        Array.isArray(existingCat.grid) &&
        existingCat.grid.length > 0
      ) {
        grid = existingCat.grid.map(
          row => [...row]
        );
      } else {
        grid = this.generateDefaultGrid(
          apiModsArray.length
        );
      }

      let gridSlots = 0;

      for (const row of grid) {
        for (const cell of row) {
          if (cell === 1) {
            gridSlots++;
          }
        }
      }

      if (
        gridSlots < apiModsArray.length
      ) {
        const COLS = 2;

        while (
          gridSlots < apiModsArray.length
        ) {
          let lastRow =
            grid[grid.length - 1];

          if (
            !lastRow ||
            lastRow.length >= COLS
          ) {
            lastRow = [];
            grid.push(lastRow);
          }

          while (
            lastRow.length < COLS &&
            gridSlots < apiModsArray.length
          ) {
            lastRow.push(1);
            gridSlots++;
          }
        }
      }

      const existingMods =
        existingCat &&
        typeof existingCat === 'object' &&
        existingCat.mods &&
        typeof existingCat.mods === 'object'
          ? existingCat.mods
          : {};

      const newMods = {};

      let apiIndex = 0;

      for (
        let row = 0;
        row < grid.length;
        row++
      ) {
        for (
          let col = 0;
          col < grid[row].length;
          col++
        ) {
          if (grid[row][col] !== 1) {
            continue;
          }

          if (
            apiIndex >= apiModsArray.length
          ) {
            break;
          }

          const apiMod =
            apiModsArray[apiIndex];

          const modKey =
            String(apiIndex + 1);

          const existingMod =
            existingMods[modKey];

          newMods[modKey] = {
            id:
              existingMod?.id ||
              `mod_${categoryName.replace(
                /\s+/g,
                '_'
              )}_${apiIndex + 1}`,

            name: apiMod.name || '',
            image: apiMod.image_url || '',

            rp_cost:
              parseInt(
                apiMod.rp_cost,
                10
              ) || 0,

            sl_cost:
              parseInt(
                apiMod.sl_cost,
                10
              ) || 0,

            ge_cost:
              parseInt(
                apiMod.ge_cost,
                10
              ) || 0,

            progress:
              existingMod?.progress ?? 0
          };

          apiIndex++;
        }
      }

      newCategories[categoryName] = {
        grid,
        mods: newMods
      };
    }

    for (const [
      categoryName,
      existingCategory
    ] of Object.entries(
      existingCategories
    )) {
      if (
        !(categoryName in newCategories)
      ) {
        newCategories[categoryName] =
          existingCategory;
      }
    }

    return {
      categories: newCategories,

      availableRP:
        existingModifications?.availableRP ?? 0,

      researchedMods:
        existingModifications?.researchedMods ?? []
    };
  }

  updateVehicleGroup(
    vehicles,
    vehicleMap,
    groupMap,
    missingVehicleIds = []
  ) {
    let updated = 0;
    let missing = 0;
    let groups = 0;

    Object.values(vehicles).forEach(
      vehicle => {
        const isGroup =
          vehicle.id?.endsWith('_group');

        if (isGroup) {
          groups++;

          if (groupMap.has(vehicle.id)) {
            const group =
              groupMap.get(vehicle.id);

            vehicle.name =
              this.formatGroupName(
                vehicle.id
              );

            vehicle.image =
              group.vehicule_group_icon || '';

            updated++;
          } else {
            vehicle.name =
              this.formatGroupName(
                vehicle.id
              );

            vehicle.image = '';

            missing++;

            missingVehicleIds.push(
              vehicle.id
            );
          }
        } else if (
          vehicle.id &&
          vehicle.id !== ''
        ) {
          if (vehicleMap.has(vehicle.id)) {
            const sv =
              vehicleMap.get(vehicle.id);

            vehicle.name =
              sv.vehicule_name || '';

            vehicle.image =
              sv.vehicule_icone || '';

            vehicle.premium =
              !!sv.vehicule_premium;

            vehicle.squadron =
              !!sv.squadron_vehicule;

            vehicle.event =
              !!sv.event_vehicule;

            if (
              sv.purchase?.research_cost_rp
            ) {
              vehicle.rp_cost =
                parseInt(
                  sv.purchase.research_cost_rp,
                  10
                );
            }

            if (
              sv.purchase?.purchase_cost_sl
            ) {
              vehicle.sl_cost =
                parseInt(
                  sv.purchase.purchase_cost_sl,
                  10
                );
            }

            const geCost =
              sv.purchase?.purchase_cost_ge ||
              sv.purchase_cost_ge;

            if (geCost) {
              vehicle.ge_cost =
                parseInt(
                  geCost,
                  10
                );
            }

            if (
              sv.purchase?.talisman_cost_ge
            ) {
              vehicle.talisman_cost_ge =
                parseInt(
                  sv.purchase.talisman_cost_ge,
                  10
                );
            } else {
              vehicle.talisman_cost_ge = 0;
            }

            if (sv.economy) {
              vehicle.crew_training_sl =
                sv.economy.crew_training_sl
                  ? parseInt(
                      sv.economy.crew_training_sl,
                      10
                    )
                  : 0;

              vehicle.experts_sl =
                sv.economy.experts_sl
                  ? parseInt(
                      sv.economy.experts_sl,
                      10
                    )
                  : 0;

              vehicle.aces_ge =
                sv.economy.aces_ge
                  ? parseInt(
                      sv.economy.aces_ge,
                      10
                    )
                  : 0;

              vehicle.research_aces_rp =
                sv.economy.research_aces_rp
                  ? parseInt(
                      sv.economy.research_aces_rp,
                      10
                    )
                  : 0;
            } else {
              vehicle.crew_training_sl = 0;
              vehicle.experts_sl = 0;
              vehicle.aces_ge = 0;
              vehicle.research_aces_rp = 0;
            }

            if (
              sv.modifications_by_group
            ) {
              vehicle.modifications =
                this.buildModifications(
                  sv,
                  vehicle.modifications
                );
            }

            updated++;
          } else {
            missing++;

            missingVehicleIds.push(
              vehicle.id
            );
          }
        }

        if (vehicle.children) {
          vehicle.children.forEach(
            child => {
              if (
                !child.id ||
                child.id === ''
              ) {
                return;
              }

              const childIsGroup =
                child.id.endsWith('_group');

              if (childIsGroup) {
                if (groupMap.has(child.id)) {
                  const sc =
                    groupMap.get(child.id);

                  child.name =
                    this.formatGroupName(
                      child.id
                    );

                  child.image =
                    sc.vehicule_group_icon || '';

                  updated++;
                } else {
                  child.name =
                    this.formatGroupName(
                      child.id
                    );

                  child.image = '';

                  missing++;

                  missingVehicleIds.push(
                    child.id
                  );
                }

                return;
              }

              if (
                vehicleMap.has(child.id)
              ) {
                const sc =
                  vehicleMap.get(child.id);

                child.name =
                  sc.vehicule_name || '';

                child.image =
                  sc.vehicule_icone || '';

                child.premium =
                  !!sc.vehicule_premium;

                child.squadron =
                  !!sc.squadron_vehicule;

                child.event =
                  !!sc.event_vehicule;

                if (
                  sc.purchase?.research_cost_rp
                ) {
                  child.rp_cost =
                    parseInt(
                      sc.purchase.research_cost_rp,
                      10
                    );
                }

                if (
                  sc.purchase?.purchase_cost_sl
                ) {
                  child.sl_cost =
                    parseInt(
                      sc.purchase.purchase_cost_sl,
                      10
                    );
                }

                const geCost =
                  sc.purchase?.purchase_cost_ge ||
                  sc.purchase_cost_ge;

                if (geCost) {
                  child.ge_cost =
                    parseInt(
                      geCost,
                      10
                    );
                }

                if (
                  sc.purchase?.talisman_cost_ge
                ) {
                  child.talisman_cost_ge =
                    parseInt(
                      sc.purchase.talisman_cost_ge,
                      10
                    );
                } else {
                  child.talisman_cost_ge = 0;
                }

                if (sc.economy) {
                  child.crew_training_sl =
                    sc.economy.crew_training_sl
                      ? parseInt(
                          sc.economy.crew_training_sl,
                          10
                        )
                      : 0;

                  child.experts_sl =
                    sc.economy.experts_sl
                      ? parseInt(
                          sc.economy.experts_sl,
                          10
                        )
                      : 0;

                  child.aces_ge =
                    sc.economy.aces_ge
                      ? parseInt(
                          sc.economy.aces_ge,
                          10
                        )
                      : 0;

                  child.research_aces_rp =
                    sc.economy.research_aces_rp
                      ? parseInt(
                          sc.economy.research_aces_rp,
                          10
                        )
                      : 0;
                } else {
                  child.crew_training_sl = 0;
                  child.experts_sl = 0;
                  child.aces_ge = 0;
                  child.research_aces_rp = 0;
                }

                if (
                  sc.modifications_by_group
                ) {
                  child.modifications =
                    this.buildModifications(
                      sc,
                      child.modifications
                    );
                }

                updated++;
              } else {
                missing++;

                missingVehicleIds.push(
                  child.id
                );
              }
            }
          );
        }
      }
    );

    return {
      updated,
      missing,
      groups
    };
  }

  formatGroupName(groupId) {
    let name =
      groupId.replace(
        /_group$/,
        ''
      );

    name =
      name.replace(
        /_/g,
        ' '
      );

    name =
      name.replace(
        /([a-zA-Z]+)-([0-9]+)([a-zA-Z]*)/g,
        (_, l, n, s) =>
          `${l.toUpperCase()}-${n}${s.toUpperCase()}`
      );

    Object.entries(
      this.acronyms
    ).forEach(([k, v]) => {
      name =
        name.replace(
          new RegExp(
            `\\b${k}\\b`,
            'gi'
          ),
          v
        );
    });

    name =
      name.replace(
        /\b([a-z])([a-z]*)\b/g,
        (m, first, rest) =>
          m !== m.toLowerCase()
            ? m
            : first.toUpperCase() +
              rest.toLowerCase()
      );

    return name;
  }

  saveProgressTree(progressTree) {
    const content =
      `export const progressTree = ` +
      `${JSON.stringify(
        progressTree,
        null,
        2
      )};`;

    fs.writeFileSync(
      this.progressTreePath,
      content,
      'utf8'
    );

    console.log(
      '💾 Fichier progressTree.js sauvegardé'
    );
  }
}

const updater =
  new ProgressTreeUpdater();

updater.update();