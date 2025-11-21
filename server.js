const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const app = express();
const DEFAULT_VEHICULE_ID = process.env.DEFAULT_VEHICULE_ID || 'p26_group';

function vehiculeAssetsFor(id) {
    return {
        vehicule_icone: `https://static.encyclopedia.warthunder.com/slots/${id}.png`,
        vehicule_image: `https://static.encyclopedia.warthunder.com/images/${id}.png`
    };
}

function removeNullValues(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeNullValues).filter(item => item !== null && item !== undefined);
    } else if (obj && typeof obj === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = removeNullValues(value);
            if (cleanedValue !== null && cleanedValue !== undefined) {
                cleaned[key] = cleanedValue;
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    return obj;
}

function cleanVehicleData(result) {
    return removeNullValues(result);
}

function cleanCostValue(value, defaultValue = null) {
    if (!value) return defaultValue;    
    if (value.match(/^\d+$/)) return value;
    if (value === "0") return value;
        const cleanValue = value.toString().trim().toLowerCase();
        if (cleanValue.includes('free') || cleanValue === 'f' || cleanValue === 'r' || cleanValue === 'e' || cleanValue === 're') {
        return "0";
    }

    const numberMatch = cleanValue.match(/(\d{1,3}(?:,\d{3})*)/);
    if (numberMatch) {
        return numberMatch[1].replace(/,/g, '');
    }

    const simpleMatch = cleanValue.match(/(\d+,?\d+)/);
    if (simpleMatch) {
        return simpleMatch[1].replace(/,/g, '');
    }
    
    console.log(`Erreur prix: "${value}"`);
    return defaultValue;
}

async function fetchVehicleData(id = DEFAULT_VEHICULE_ID) {
    const url = `https://wiki.warthunder.com/unit/${id}`;
    let browser;

    if (id.includes('_group')) {
        const image = `https://static.encyclopedia.warthunder.com/slots/${id}.png`;
        return {
            vehicule_group_id: id,
            vehicule_group_icon: image,
        };
    };
    
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const fullText = $('body').text();
        let vehicule_name = null;
        const nameElement = $('.game-unit_name').first().text().trim();
        if (nameElement) {
            vehicule_name = nameElement;
        } else {
            vehicule_name = 'Unknown';
        }

        let rp_value = null;
        let sl_value = null;
        let talisman_cost = null;
        let crew_training_sl = null;
        let experts_sl = null;
        let aces_ge = null;
        let research_aces_rp = null;
        let vehicule_premium = 0;
        let squadron_vehicule = 0;
        let reserve_vehicule = 0;

        const premiumTag = $('div.text-truncate').filter((i, el) => {
            return $(el).text().trim().toLowerCase() === "premium vehicle";
        });
        if (premiumTag.length > 0) {
            vehicule_premium = 1;
        }
        
        const squadronTag = $('div.text-truncate').filter((i, el) => {
            return $(el).text().trim().toLowerCase() === "squadron vehicle";
        });
        if (squadronTag.length > 0) {
            squadron_vehicule = 1;
        }

        const reserveTag = $('div.text-truncate').filter((i, el) => {
            return $(el).text().trim().toLowerCase().includes("reserve");
        });
        if (reserveTag.length > 0) {
            reserve_vehicule = 1;
        }

        let ge_cost_premium = null;
        if (vehicule_premium === 1) {
            $('.game-unit_card-info_title').each((i, el) => {
                const label = $(el).text().trim();
                if (/Purchase|Buy|Cost/i.test(label)) {
                    let geText = $(el).prev('.game-unit_card-info_value').find('div').first().text().trim();
                    console.log('GE text found:', geText);
                    if (geText.includes('GE') || $(el).prev('.game-unit_card-info_value').find('img[src*="eagle"]').length > 0) {
                        const geMatch = geText.match(/(\d{1,3}(?:,\d{3})*)/);
                        if (geMatch) {
                            ge_cost_premium = geMatch[1].replace(/,/g, '');
                            console.log('GE cost found in card:', ge_cost_premium);
                        }
                    }
                }
            });

            if (!ge_cost_premium) {
                $('img').each((i, img) => {
                    const src = $(img).attr('src') || '';
                    if (/eagles|item_type_eagles|gui_skin\/item_type_eagles/i.test(src)) {
                        const parent = $(img).closest('div');
                        const geText = parent.text().trim();
                        const geMatch = geText.match(/(\d+)\s*(?:GE|Eagles)/);
                        if (geMatch) {
                            ge_cost_premium = geMatch[1];
                            console.log('GE cost found with eagle icon:', ge_cost_premium);
                            return false;
                        }
                    }
                });
            }

            if (!ge_cost_premium) {
                const geMatches = fullText.match(/(\d+)\s*(?:GE|Golden Eagles)/g);
                if (geMatches) {
                    for (let match of geMatches) {
                        const numMatch = match.match(/(\d+)/);
                        if (numMatch) {
                            ge_cost_premium = numMatch[1];
                            console.log('GE cost found in text:', ge_cost_premium);
                            break;
                        }
                    }
                }
            }

            const rewardTag = $('div.text-truncate').filter((i, el) => {
                const text = $(el).text().trim().toLowerCase();
                return text.includes("reward") || text.includes("event") || text.includes("gift");
            });
            if (rewardTag.length > 0) {
                ge_cost_premium = null;
            }
        }

        console.log(`=== ${id} ===`);
        console.log('Premium:', vehicule_premium, 'Squadron:', squadron_vehicule, 'Reserve:', reserve_vehicule);
        console.log('GE cost premium:', ge_cost_premium);

        if (!rp_value || !sl_value) {
            const rpPatterns = [
                /Research[^\d]*([\d,]+)\s*RP/i,
                /([\d,]+)\s*RP.*Research/i,
                /Research.*?([\d,]+)\s*RP/i
            ];
            
            const slPatterns = [
                /Purchase[^\d]*([\d,]+)\s*SL/i,
                /Buy[^\d]*([\d,]+)\s*SL/i,
                /([\d,]+)\s*SL.*Purchase/i,
                /([\d,]+)\s*SL.*Buy/i
            ];
            
            for (const pattern of rpPatterns) {
                const match = fullText.match(pattern);
                if (match && match[1] && !rp_value) {
                    rp_value = match[1].replace(/,/g, '');
                    console.log('RP found with specific pattern:', rp_value);
                    break;
                }
            }
            
            for (const pattern of slPatterns) {
                const match = fullText.match(pattern);
                if (match && match[1] && !sl_value) {
                    sl_value = match[1].replace(/,/g, '');
                    console.log('SL found with specific pattern:', sl_value);
                    break;
                }
            }
        }

        $('.game-unit_card-info_title').each((i, el) => {
            const label = $(el).text().trim();
            if (/Research/i.test(label)) {
                let rpText = $(el).prev('.game-unit_card-info_value').find('div').first().text().trim();
                rp_value = (rpText === 'Free' || rpText === 'FREE') ? "0" : rpText.replace(/,/g, '');
                console.log('RP found in card:', rp_value);
            }
            if (/Purchase|Buy|Cost/i.test(label)) {
                let slText = $(el).prev('.game-unit_card-info_value').find('div').first().text().trim();
                sl_value = (slText === 'Free' || slText === 'FREE') ? "0" : slText.replace(/,/g, '');
                console.log('SL found in card:', sl_value);
            }
        });

        if (!rp_value || !sl_value) {
            $('.game-unit_card-info_line').each((i, el) => {
                $(el).find('.game-unit_card-info_title').each((j, titleEl) => {
                    const label = $(titleEl).text().trim();
                    if (/Research/i.test(label) && !rp_value) {
                        let rpText = $(titleEl).siblings('.game-unit_card-info_value').find('div').first().text().trim();
                        rp_value = (rpText === 'Free' || rpText === 'FREE') ? "0" : rpText.replace(/,/g, '');
                        console.log('RP found in line:', rp_value);
                    }
                    if (/Purchase|Buy|Cost/i.test(label) && !sl_value) {
                        let slText = $(titleEl).siblings('.game-unit_card-info_value').find('div').first().text().trim();
                        sl_value = (slText === 'Free' || slText === 'FREE') ? "0" : slText.replace(/,/g, '');
                        console.log('SL found in line:', sl_value);
                    }
                });
            });
        }

        if (!rp_value || !sl_value) {
            $('table').each((i, table) => {
                const tableText = $(table).text();
                if (tableText.includes('Research') && tableText.includes('RP') && !rp_value) {
                    const rpMatch = tableText.match(/Research[^\d]*([\d,]+(?:,\d{3})*)/);
                    if (rpMatch) {
                        rp_value = rpMatch[1].replace(/,/g, '');
                        console.log('RP found in table:', rp_value);
                    }
                }
                if ((tableText.includes('Purchase') || tableText.includes('Buy')) && tableText.includes('SL') && !sl_value) {
                    const slMatch = tableText.match(/(?:Purchase|Buy)[^\d]*([\d,]+(?:,\d{3})*)/);
                    if (slMatch) {
                        sl_value = slMatch[1].replace(/,/g, '');
                        console.log('SL found in table:', sl_value);
                    }
                }
            });
        }

        if (!rp_value) {
            const m = fullText.match(/Research(?: cost)?\s*[:\s-]*([\d,]+(?:,\d{3})*)\s*RP/i) || fullText.match(/([\d,]+(?:,\d{3})*)\s*RP/i);
            if (m && m[1]) {
                if (m[1].toLowerCase() === 'free' || m[1].toLowerCase() === 'free') {
                    rp_value = "0";
                } else if (m[1].match(/^\d/)) {
                    rp_value = m[1].replace(/,/g, '');
                }
                console.log('RP found in text:', rp_value);
            }
        }
        if (!sl_value) {
            const m = fullText.match(/Purchase(?: cost)?\s*[:\s-]*([\d,]+(?:,\d{3})*)\s*SL/i)
                    || fullText.match(/Buy(?: for)?\s*[:\s-]*([\d,]+(?:,\d{3})*)\s*SL/i)
                    || fullText.match(/([\d,]+(?:,\d{3})*)\s*SL/i);
            if (m && m[1]) {
                if (m[1].toLowerCase() === 'free' || m[1].toLowerCase() === 'free') {
                    sl_value = "0";
                } else if (m[1].match(/^\d/)) {
                    sl_value = m[1].replace(/,/g, '');
                }
                console.log('SL found in text:', sl_value);
            }
        }

        if (!rp_value) {
            const m = fullText.match(/Research(?: cost)?\s*[:\s-]*([\d,]+(?:,\d{3})*)/i);
            if (m && m[1]) {
                if (m[1].toLowerCase() === 'free' || m[1].toLowerCase() === 'free') {
                    rp_value = "0";
                } else if (m[1].match(/^\d/)) {
                    rp_value = m[1].replace(/,/g, '');
                }
                console.log('RP fallback:', rp_value);
            }
        }
        if (!sl_value) {
            const m = fullText.match(/Purchase(?: cost)?\s*[:\s-]*([\d,]+(?:,\d{3})*)/i) || fullText.match(/Buy(?: for)?\s*[:\s-]*([\d,]+(?:,\d{3})*)/i);
            if (m && m[1]) {
                if (m[1].toLowerCase() === 'free' || m[1].toLowerCase() === 'free') {
                    sl_value = "0";
                } else if (m[1].match(/^\d/)) {
                    sl_value = m[1].replace(/,/g, '');
                }
                console.log('SL fallback:', sl_value);
            }
        }

        rp_value = cleanCostValue(rp_value, null);
        sl_value = cleanCostValue(sl_value, null);

        if (!reserve_vehicule) {
            if ((rp_value === "0" && sl_value === "0") && !vehicule_premium && !squadron_vehicule) {
                reserve_vehicule = 1;
                console.log(`Vehicle ${id} detected as reserve based on costs`);
            }
            
            const reserveIndicators = [
                'reserve',
                'rank i',
                'br 1.',
                'starter',
                'beginner'
            ];
            
            const lowerName = vehicule_name.toLowerCase();
            const lowerText = fullText.toLowerCase();
            
            const hasReserveIndicator = reserveIndicators.some(indicator => 
                lowerName.includes(indicator) || lowerText.includes(indicator)
            );
            
            if (hasReserveIndicator && !vehicule_premium && !squadron_vehicule) {
                reserve_vehicule = 1;
                console.log(`Vehicle ${id} detected as reserve based on indicators`);
                
                if (!rp_value) rp_value = "0";
                if (!sl_value) sl_value = "0";
            }
        }

        let event_vehicule = 0;

        if (vehicule_premium === 0 && squadron_vehicule === 0 && reserve_vehicule === 0) {
            const hasNoRpCost = !rp_value || rp_value === "0" || rp_value === "Free";
            const hasNoSlCost = !sl_value || sl_value === "0" || sl_value === "Free";
            
            if (hasNoRpCost && hasNoSlCost) {
                event_vehicule = 1;
                
                const eventTags = $('div.text-truncate').filter((i, el) => {
                    const text = $(el).text().trim().toLowerCase();
                    return text.includes("event") || 
                           text.includes("reward") || 
                           text.includes("gift") || 
                           text.includes("battle pass") ||
                           text.includes("tournament") ||
                           text.includes("crafting") ||
                           text.includes("operation") ||
                           text.includes("seasonal");
                });
                
                if (eventTags.length === 0) {
                    const eventKeywords = [
                        'event vehicle', 'reward vehicle', 'gift vehicle', 'battle pass',
                        'tournament', 'crafting event', 'operation', 'seasonal reward'
                    ];
                    
                    const lowerText = fullText.toLowerCase();
                    const hasEventKeyword = eventKeywords.some(keyword => 
                        lowerText.includes(keyword)
                    );
                    
                    if (!hasEventKeyword) {
                        event_vehicule = 0;
                    }
                }
            }
        }

        console.log('Final values - RP:', rp_value, 'SL:', sl_value, 'Event:', event_vehicule, 'Reserve:', reserve_vehicule);

        talisman_cost = null;
        let found = false;

        $('*:contains("Talisman")').each((i, el) => {
            const txt = $(el).text();
            const m = txt.match(/Talisman(?: cost)?\s*[:\s]*([\d,]+)\s*(?:GE|Eagles)?/i);
            if (m) { talisman_cost = m[1].replace(/,/g, ''); found = true; return false; }
            const m2 = txt.match(/([\d,]+)\s*(?:GE|Eagles)/i);
            if (m2) { talisman_cost = m2[1].replace(/,/g, ''); found = true; return false; }
        });

        if (!found) {
            $('img').each((i, img) => {
                const src = $(img).attr('src') || '';
                if (/eagles|item_type_eagles|gui_skin\/item_type_eagles/i.test(src)) {
                    const p = $(img).parent();
                    const ptxt = p.text();
                    const m = ptxt.match(/Talisman(?: cost)?\s*[:\s]*([\d,]+)\s*(?:GE|Eagles)?/i) || ptxt.match(/([\d,]+)\s*(?:GE|Eagles)/i);
                    if (m) { talisman_cost = m[1].replace(/,/g, ''); found = true; return false; }
                    const prev = $(img).prev();
                    if (prev.length) {
                        const m2 = prev.text().match(/([\d,]+)\s*(?:GE|Eagles)/i);
                        if (m2) { talisman_cost = m2[1].replace(/,/g, ''); found = true; return false; }
                    }
                }
            });
        }

        if (!found) {
            const pageText = fullText;
            const m = pageText.match(/Talisman(?: cost)?\s*[:\s]*([\d,]+)\s*(?:GE|Eagles)?/i) || pageText.match(/([\d,]+)\s*(?:GE|Eagles)\s*Talisman/i);
            if (m) talisman_cost = m[1].replace(/,/g, '');
        }

        function findNumberForKeyword(text, keyword) {
            if (!text) return null;
            const re = new RegExp(keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s*[:\\s]*([0-9\\,]+|Free|FREE)", 'i');
            const m = text.match(re);
            if (m && m[1]) {
                return (m[1] === 'Free' || m[1] === 'FREE') ? "0" : m[1].replace(/,/g, '');
            }
            return null;
        }

        let econText = '';
        let economySection = $('[id*="econom"], [class*="econom"], h2:contains("Economy"), h3:contains("Economy")').first();
        if (economySection.length) {
            if (/^h2|h3$/i.test(economySection[0].tagName)) {
                const next = economySection.next();
                economySection = next.length ? next : economySection.parent();
            }
            econText = economySection.text();
        } else {
            econText = fullText;
        }

        crew_training_sl = findNumberForKeyword(econText, 'Crew training');
        experts_sl = findNumberForKeyword(econText, 'Experts');
        aces_ge = findNumberForKeyword(econText, 'Aces');
        research_aces_rp = findNumberForKeyword(econText, 'Research Aces') || findNumberForKeyword(econText, 'Research ace');

        const pageText = fullText;
        if (!crew_training_sl) crew_training_sl = findNumberForKeyword(pageText, 'Crew training');
        if (!experts_sl) experts_sl = findNumberForKeyword(pageText, 'Experts');
        if (!aces_ge) aces_ge = findNumberForKeyword(pageText, '\\bAces\\b');
        if (!research_aces_rp) research_aces_rp = findNumberForKeyword(pageText, 'Research Aces') || findNumberForKeyword(pageText, 'Research ace');

        let purchaseObject = {};

        if (vehicule_premium === 1) {
            if (ge_cost_premium) {
                purchaseObject = {
                    purchase_cost_ge: cleanCostValue(ge_cost_premium, null)
                };
                sl_value = null;
            } else {
                purchaseObject = undefined;
            }
        } else if (squadron_vehicule === 1) {
            purchaseObject = {
                research_cost_rp_squadron: cleanCostValue(rp_value, "0"),
                purchase_cost_sl: cleanCostValue(sl_value, "0"),
                talisman_cost_ge: talisman_cost
            };
        } else {
            purchaseObject = {
                research_cost_rp: cleanCostValue(rp_value, "0"),
                purchase_cost_sl: cleanCostValue(sl_value, "0"),
                talisman_cost_ge: talisman_cost
            };
        }

        if (!event_vehicule && !vehicule_premium && !squadron_vehicule && !reserve_vehicule) {
            if (!rp_value || !sl_value) {
                const isSpecialCase = fullText.toLowerCase().includes("event") || 
                                     fullText.toLowerCase().includes("reward") ||
                                     fullText.toLowerCase().includes("gift") ||
                                     fullText.toLowerCase().includes("battle pass") ||
                                     fullText.toLowerCase().includes("crafting");
                
                if (!isSpecialCase) {
                    console.warn(`Vehicle ${id} appears to be standard but missing RP/SL values`);
                } else {
                    event_vehicule = 1;
                    console.log(`Vehicle ${id} detected as event vehicle based on keywords`);
                }
            }
        }

        let modifications = {};
        try {
            $('table.game-unit_mods-table').each((i, table) => {
                const groupHeader = $(table).find('thead th').first().text().trim() || 'Unknown';
                
                if (!modifications[groupHeader]) {
                    modifications[groupHeader] = [];
                }
                
                $(table).find('button.game-unit_mod').each((j, btn) => {
                    const $btn = $(btn);
                    const modName = $btn.find('span').first().text().trim();
                    const modImage = $btn.find('img').attr('src') || '';
                    const popoverHtml = $btn.attr('data-feature-popover');
                    
                    if (modName && popoverHtml) {
                        let rp_cost = null;
                        let sl_cost = null;
                        let ge_cost = null;
                        
                        const $popover = cheerio.load(popoverHtml);
                        
                        $popover('.game-unit_mod-char-line').each((k, line) => {
                            const text = $popover(line).text().trim();
                            
                            if (text.includes('Research')) {
                                const match = text.match(/(\d+,?\d*)/);
                                if (match) rp_cost = match[1].replace(/,/g, '');
                            }
                            if (text.includes('Purchase')) {
                                const match = text.match(/(\d+,?\d*)/);
                                if (match) sl_cost = match[1].replace(/,/g, '');
                            }
                            if (text.includes('or ')) {
                                const match = text.match(/or\s+(\d+,?\d*)/);
                                if (match) ge_cost = match[1].replace(/,/g, '');
                            }
                        });
                        
                        modifications[groupHeader].push({
                            name: modName,
                            rp_cost: rp_cost,
                            sl_cost: sl_cost,
                            ge_cost: ge_cost,
                            image_url: modImage
                        });
                    }
                });
            });
        } catch (e) {
            console.warn(`Could not extract modifications for ${id}:`, e.message);
            modifications = {};
        }

        const assets = vehiculeAssetsFor(id);
        const modsCost = calculateModificationsCost(modifications);

        let battle_rating_ab = null;
        let battle_rating_rb = null;
        let battle_rating_sb = null;
        let rank = null;

        const rankElements = $('.game-unit_card-info_value');
        rankElements.each((i, el) => {
            const text = $(el).text().trim();
            if (text.match(/^[IVX]+$/)) {
                rank = text;
            }
        });

        $('*:contains("Battle rating")').each((i, el) => {
            const text = $(el).text();
            if (text.includes('AB')) {
                const match = text.match(/AB\s*[:\s]*([\d.]+)/i);
                if (match) battle_rating_ab = match[1];
            }
            if (text.includes('RB')) {
                const match = text.match(/RB\s*[:\s]*([\d.]+)/i);
                if (match) battle_rating_rb = match[1];
            }
            if (text.includes('SB')) {
                const match = text.match(/SB\s*[:\s]*([\d.]+)/i);
                if (match) battle_rating_sb = match[1];
            }
        });

        $('*:contains("Rank")').each((i, el) => {
            const text = $(el).text();
            const match = text.match(/Rank\s*[:\s]*([IVX]+)/i);
            if (match) rank = match[1];
        });

        const result = {
            vehicule_id: id,
            vehicule_name: vehicule_name,
            vehicule_icone: assets.vehicule_icone,
            vehicule_image: assets.vehicule_image,
            vehicule_premium: vehicule_premium,
            squadron_vehicule: squadron_vehicule,
            reserve_vehicule: reserve_vehicule,
            event_vehicule: event_vehicule,
            battle_rating: {
                ab: battle_rating_ab,
                rb: battle_rating_rb,
                sb: battle_rating_sb
            },
            rank: rank,
            purchase: purchaseObject,
            economy: {
                crew_training_sl: crew_training_sl,
                experts_sl: experts_sl,
                aces_ge: aces_ge,
                research_aces_rp: research_aces_rp
            },
            modifications_by_group: modifications,
            modifications_total_cost: {
                total_rp: modsCost.total_rp,
                total_sl: modsCost.total_sl,
                total_ge: modsCost.total_ge
            }
        };

        return cleanVehicleData(result);

    } catch (error) {
        console.error(`Error fetching vehicle data for ${id}:`, error.message);
        throw error;
    }
}

function calculateModificationsCost(modifications) {
    let total_rp = 0;
    let total_sl = 0;
    let total_ge = 0;

    for (const group in modifications) {
        if (!Array.isArray(modifications[group])) continue;
        modifications[group].forEach(mod => {
            if (mod && mod.rp_cost !== null && mod.rp_cost !== undefined && mod.rp_cost !== '') {
                total_rp += parseInt(mod.rp_cost, 10) || 0;
            }
            if (mod && mod.sl_cost !== null && mod.sl_cost !== undefined && mod.sl_cost !== '') {
                total_sl += parseInt(mod.sl_cost, 10) || 0;
            }
            if (mod && mod.ge_cost !== null && mod.ge_cost !== undefined && mod.ge_cost !== '') {
                total_ge += parseInt(mod.ge_cost, 10) || 0;
            }
        });
    }

    return {
        total_rp: total_rp,
        total_sl: total_sl,
        total_ge: total_ge
    };
}

async function writeResultToFile(result) {
    try {
        const outPath = path.join(__dirname, 'server-response.json');

        const entry = Object.assign({}, result, { fetched_at: new Date().toISOString() });

        let existing = [];
        try {
            const raw = await fs.promises.readFile(outPath, 'utf8');
            if (raw && raw.trim()) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    existing = parsed;
                } else if (parsed && typeof parsed === 'object') {
                    existing = [parsed];
                }
            }
        } catch (readErr) {
            if (readErr.code && readErr.code !== 'ENOENT') {
                console.error('Warning: could not read existing server-response.json, starting fresh:', readErr.message || readErr);
            }
        }

        if (entry && entry.vehicule_id) {
            existing = existing.filter(e => !(e && e.vehicule_id === entry.vehicule_id));
        }

        existing.push(entry);

        await fs.promises.writeFile(outPath, JSON.stringify(existing, null, 2), 'utf8');
    } catch (writeErr) {
        console.error('Failed to write server-response.json:', writeErr);
    }
}

app.get('/api', async (req, res) => {
    const id = req.query.id || DEFAULT_VEHICULE_ID;
    try {
        const result = await fetchVehicleData(id);
        await writeResultToFile(result);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: `${e.message}` });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

(async () => {
    const NO_STARTUP_FETCH = process.env.NO_STARTUP_FETCH === '1' || process.env.NO_STARTUP_FETCH === 'true';
    const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '0', 10);
    const POLL_LOOP_DELAY_MS = parseInt(process.env.POLL_LOOP_DELAY_MS || '1000', 10);

    let vehicleList = [];
    if (process.env.VEHICLE_LIST) {
        vehicleList = process.env.VEHICLE_LIST.split(',').map(s => s.trim()).filter(Boolean);
    } else {
        const listPath = path.join(__dirname, 'vehicles.txt');
        try {
            const raw = await fs.promises.readFile(listPath, 'utf8');
            vehicleList = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        } catch (e) {
            if (e.code && e.code !== 'ENOENT') {
                console.error('Could not read vehicles.txt:', e.message || e);
            }
        }
    }

    if (!NO_STARTUP_FETCH) {
        try {
            const startupId = vehicleList.length ? vehicleList[0] : DEFAULT_VEHICULE_ID;
            console.log(`Fetching vehicle data on startup for '${startupId}'...`);
            const startupResult = await fetchVehicleData(startupId);
            await writeResultToFile(startupResult);
            console.log('server-response.json written (startup).');
        } catch (err) {
            console.error('Startup fetch failed:', err.message || err);
        }
    } else {
        console.log('NO_STARTUP_FETCH set — skipping startup fetch');
    }

    if (POLL_INTERVAL_MS > 0) {
        console.log(`Polling enabled: fetch every ${POLL_INTERVAL_MS} ms`);
        setInterval(async () => {
            try {
                if (vehicleList.length) {
                    for (const id of vehicleList) {
                        const r = await fetchVehicleData(id);
                        await writeResultToFile(r);
                        console.log(`server-response.json written (poll) for ${id}.`);
                    }
                } else {
                    const r = await fetchVehicleData(DEFAULT_VEHICULE_ID);
                    await writeResultToFile(r);
                    console.log('server-response.json written (poll).');
                }
            } catch (err) {
                console.error('Polling fetch failed:', err.message || err);
            }
        }, POLL_INTERVAL_MS);
    } else {
        console.log('Polling disabled (set POLL_INTERVAL_MS to milliseconds to enable)');

        if (vehicleList.length) {
            console.log(`Processing vehicle list once (${vehicleList.length} items)`);
            (async () => {
                for (const id of vehicleList) {
                    try {
                        const r = await fetchVehicleData(id);
                        await writeResultToFile(r);
                        console.log(`server-response.json written (loop) for ${id}.`);
                    } catch (err) {
                        console.error(`Loop fetch failed for ${id}:`, err.message || err);
                    }
                    await new Promise(resolve => setTimeout(resolve, POLL_LOOP_DELAY_MS));
                }
                console.log('All vehicles processed, exiting.');
                process.exit(0);
            })();
        } else {
            console.log('No vehicle list provided; nothing to loop over when polling disabled.');
        }
    }
})();