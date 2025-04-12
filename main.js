import { initTabControl } from 'tabControl.js';
import { initMdfSheets } from 'mdfSheets.js';
import { initPieces } from 'pieces.js';
import { initAccessories } from 'accessories.js';
import { initCutPlan } from 'cutPlan.js';
import { initBudget } from 'budget.js';

document.addEventListener('DOMContentLoaded', function() {
    initTabControl();
    initMdfSheets();
    initPieces();
    initAccessories();
    initCutPlan();
    initBudget();
});
