// extract-techtree.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://wiki.warthunder.com';

const NATIONS = {
    usa: {
        name: 'USA',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    germany: {
        name: 'Germany',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    ussr: {
        name: 'USSR',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    britain: {
        name: 'Great Britain',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    japan: {
        name: 'Japan',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    china: {
        name: 'China',
        types: ['Aviation', 'Helicopters', 'Ground']
    },
    italy: {
        name: 'Italy',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    france: {
        name: 'France',
        types: ['Aviation', 'Helicopters', 'Ground', 'Ships', 'Boats']
    },
    sweden: {
        name: 'Sweden',
        types: ['Aviation', 'Helicopters', 'Ground']
    },
    israel: {
        name: 'Israel',
        types: ['Aviation', 'Helicopters', 'Ground']
    }
};

const VEHICLE_TYPES = {
    Aviation: {
        label: 'Avion',
        path: '/aviation',
        ranks: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
    },
    Helicopters: {
        label: 'Helico',
        path: '/helicopters',
        ranks: ['V', 'VI', 'VII']
    },
    Ground: {
        label: 'Tank',
        path: '/ground',
        ranks: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
    },
    Ships: {
        label: 'Bateau',
        path: '/ships',
        ranks: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    },
    Boats: {
        label: 'Cotier',
        path: '/boats',
        ranks: ['I', 'II', 'III', 'IV', 'V']
    }
};

// C:\Users\REMI\Documents\dev\wt-progress-tracker\src\data\progressTree.js
const OUTPUT_FILE = path.join(
    __dirname,
    'src',
    'data',
    'progressTree.js'
);

const axiosConfig = {
    timeout: 30000,
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/140.0 Safari/537.36',
        'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language':
            'en-US,en;q=0.9'
    }
};

function extractCellVehicle($, td) {
    const group =
        $(td)
            .children('.wt-tree_group')
            .first();

    if (group.length > 0) {
        const icon =
            group.find('.wt-tree_item-icon').first();

        const style =
            icon.attr('style') || '';

        const match =
            style.match(/slots\/([^"'()]+)\.png/);

        const groupId =
            match ? match[1] : null;

        if (!groupId) {
            return null;
        }

        const children = [];

        group
            .find(
                '.wt-tree_group-items > .wt-tree_item'
            )
            .each((index, element) => {
                const id =
                    $(element).attr(
                        'data-unit-id'
                    );

                if (id) {
                    children.push({
                        id
                    });
                }
            });

        return {
            id: groupId,
            children
        };
    }

    const vehicle =
        $(td)
            .children('.wt-tree_item')
            .first();

    if (vehicle.length > 0) {
        const vehicleId =
            vehicle.attr('data-unit-id');

        if (vehicleId) {
            return {
                id: vehicleId
            };
        }
    }

    return null;
}

function tableToGrid($, table) {
    const grid = [];
    const cells = [];

    $(table)
        .find('tbody > tr')
        .each((rowIndex, tr) => {
            const row = [];

            $(tr)
                .children('td')
                .each((colIndex, td) => {
                    const vehicle =
                        extractCellVehicle(
                            $,
                            td
                        );

                    const hasVehicle =
                        vehicle !== null;

                    row.push(
                        hasVehicle
                            ? 1
                            : 0
                    );

                    if (hasVehicle) {
                        cells.push({
                            row: rowIndex,
                            col: colIndex,
                            vehicle
                        });
                    }
                });

            if (row.length > 0) {
                grid.push(row);
            }
        });

    return {
        grid,
        cells
    };
}

function getGridWidth(grid) {
    return Math.max(
        0,
        ...grid.map(
            row => row.length
        )
    );
}

function extractRank($, rankElement) {
    const rank = {
        researchable: {
            grid: [],
            cells: []
        },
        premium: {
            grid: [],
            cells: []
        }
    };

    const researchableContainer =
        $(rankElement)
            .children('div')
            .filter(function () {
                const style =
                    ($(this).attr('style') || '')
                        .replace(/\s/g, '');

                return style ===
                    'grid-column:1/3';
            })
            .first();

    if (researchableContainer.length > 0) {
        const table =
            researchableContainer
                .find(
                    'table.wt-tree_rank-instance'
                )
                .first();

        if (table.length > 0) {
            rank.researchable =
                tableToGrid(
                    $,
                    table
                );
        }
    }

    const premiumContainer =
        $(rankElement)
            .children('div')
            .filter(function () {
                const style =
                    ($(this).attr('style') || '')
                        .replace(/\s/g, '');

                return style ===
                    'grid-column:4/6';
            })
            .first();

    if (premiumContainer.length > 0) {
        const table =
            premiumContainer
                .find(
                    'table.wt-tree_rank-instance'
                )
                .first();

        if (table.length > 0) {
            rank.premium =
                tableToGrid(
                    $,
                    table
                );
        }
    }

    return rank;
}

function buildMergedRank(
    researchable,
    premium
) {
    const researchableWidth =
        getGridWidth(
            researchable.grid
        );

    const premiumWidth =
        getGridWidth(
            premium.grid
        );

    const totalWidth =
        researchableWidth +
        premiumWidth;

    const height =
        Math.max(
            researchable.grid.length,
            premium.grid.length
        );

    const grid = [];

    for (
        let rowIndex = 0;
        rowIndex < height;
        rowIndex++
    ) {
        const row = [];

        for (
            let colIndex = 0;
            colIndex < researchableWidth;
            colIndex++
        ) {
            const value =
                researchable.grid[
                    rowIndex
                ]?.[colIndex] || 0;

            row.push(
                value ? 1 : 0
            );
        }

        for (
            let colIndex = 0;
            colIndex < premiumWidth;
            colIndex++
        ) {
            const value =
                premium.grid[
                    rowIndex
                ]?.[colIndex] || 0;

            row.push(
                value ? 1 : 0
            );
        }

        grid.push(row);
    }

    const cells = [];

    for (
        const cell
        of researchable.cells
    ) {
        cells.push({
            row: cell.row,
            col: cell.col,
            vehicle: cell.vehicle
        });
    }

    for (
        const cell
        of premium.cells
    ) {
        cells.push({
            row: cell.row,
            col:
                researchableWidth +
                cell.col,
            vehicle: cell.vehicle
        });
    }

    cells.sort((a, b) => {
        if (a.row !== b.row) {
            return a.row - b.row;
        }
        return a.col - b.col;
    });

    const vehicles = {};

    cells.forEach(
        (cell, index) => {
            vehicles[index + 1] =
                cell.vehicle;
        }
    );

    while (
        grid.length > 0 &&
        grid[
            grid.length - 1
        ].every(
            value => value === 0
        )
    ) {
        grid.pop();
    }

    const gridVehicleCount =
        grid.reduce(
            (total, row) => {
                return total +
                    row.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    );
            },
            0
        );

    const vehicleCount =
        Object.keys(
            vehicles
        ).length;

    if (
        gridVehicleCount !==
        vehicleCount
    ) {
        console.warn(
            `      ⚠️ Incohérence : ` +
            `${gridVehicleCount} cases occupées ` +
            `mais ${vehicleCount} véhicules`
        );
    }

    return {
        grid,
        vehicles
    };
}

function extractRanks(
    $,
    rankNames,
    nationCode
) {
    const result = [];

    const nationTree =
        $(`.unit-tree[data-tree-id="${nationCode}"]`);

    if (nationTree.length === 0) {
        console.warn(
            `      ⚠️ Arbre introuvable pour ${nationCode}`
        );

        return rankNames.map(
            rankName => ({
                name: rankName,
                grid: [],
                vehicles: {}
            })
        );
    }

    const rankElements =
        nationTree.find(
            '.wt-tree_rank.wt-tree_row'
        );

    console.log(
        `  Arbre ${nationCode} : ` +
        `${rankElements.length} rangs trouvés`
    );

    rankElements.each(
        (index, element) => {
            const rankData =
                extractRank(
                    $,
                    element
                );

            const merged =
                buildMergedRank(
                    rankData.researchable,
                    rankData.premium
                );

            const rankName =
                rankNames[index] ||
                String(index + 1);

            const width =
                getGridWidth(
                    merged.grid
                );

            const vehicleCount =
                Object.keys(
                    merged.vehicles
                ).length;

            const gridVehicleCount =
                merged.grid.reduce(
                    (total, row) => {
                        return total +
                            row.reduce(
                                (sum, value) =>
                                    sum + value,
                                0
                            );
                    },
                    0
                );

            console.log(
                `  Rank ${rankName}:`
            );
            console.log(
                `    ${merged.grid.length} lignes`
            );
            console.log(
                `    ${width} colonnes`
            );
            console.log(
                `    ${vehicleCount} véhicules`
            );
            console.log(
                `    ${gridVehicleCount} cases occupées`
            );

            result.push({
                name: rankName,
                grid: merged.grid,
                vehicles: merged.vehicles
            });
        }
    );

    return rankNames.map(
        rankName => {
            const found =
                result.find(
                    rank =>
                        rank.name === rankName
                );

            return found || {
                name: rankName,
                grid: [],
                vehicles: {}
            };
        }
    );
}

async function extractVehicleType(
    nationCode,
    nationName,
    typeName,
    typeConfig
) {
    const url =
        `${BASE_URL}${typeConfig.path}?v=t&t_c=${encodeURIComponent(nationCode)}`;
    console.log(`Nation demandée : ${nationCode}`);
    console.log(`URL demandée    : ${url}`);
    console.log('\n');
    console.log('========================================');
    console.log(`${nationName} / ${typeName}`);
    console.log(`URL : ${url}`);
    console.log('========================================');

    try {
        const response = await axios.get(url, axiosConfig);

        console.log(
            `HTML reçu : ${response.data.length} caractères`
        );

        const $ = cheerio.load(response.data);

        const html = response.data;

        const hasNationMarker =
            html.includes(`t_c=${nationCode}`) ||
            html.includes(`data-nation="${nationCode}"`) ||
            html.includes(`data-nation='${nationCode}'`);

        if (!hasNationMarker) {
            console.warn(
                `⚠️ Impossible de confirmer la nation ${nationName}`
            );
        }

        const rankCount =
            $('.wt-tree_rank.wt-tree_row').length;

        console.log(
            `Rangs HTML trouvés : ${rankCount}`
        );

        if (rankCount === 0) {
            console.error(
                `⚠️ Aucun rang trouvé pour ${nationName}.`
            );
        }

        const ranks =
            extractRanks(
                $,
                typeConfig.ranks,
                nationCode
            );

        return {
            name: nationName,
            code: nationCode,
            ranks
        };

    } catch (error) {
        console.error(
            `Erreur ${nationName} / ${typeName}:`,
            error.message
        );

        return {
            name: nationName,
            code: nationCode,
            ranks:
                typeConfig.ranks.map(
                    rank => ({
                        name: rank,
                        grid: [],
                        vehicles: {}
                    })
                )
        };
    }
}

function writeOutput(data) {
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const output =
        `// Généré automatiquement.\n` +
        `export const progressTree = ` +
        `${JSON.stringify(data, null, 4)};\n`;

    fs.writeFileSync(
        OUTPUT_FILE,
        output,
        'utf8'
    );
    console.log('\n');
    console.log(
        `Fichier généré avec succès dans : ${OUTPUT_FILE}`
    );
}

async function main() {
    const result = {};

    for (
        const [nationCode, nation]
        of Object.entries(NATIONS)
    ) {
        console.log('\n\n');
        console.log(
            `NATION : ${nation.name}`
        );

        for (
            const typeName
            of nation.types
        ) {
            const typeConfig =
                VEHICLE_TYPES[typeName];

            if (!typeConfig) {
                console.warn(
                    `⚠️ Type inconnu : ${typeName}`
                );
                continue;
            }

            const data =
                await extractVehicleType(
                    nationCode,
                    nation.name,
                    typeName,
                    typeConfig
                );

            const key =
                `${nation.name}_${typeConfig.label}`;

            result[key] = data;
        }
    }

    writeOutput(result);
}

main();