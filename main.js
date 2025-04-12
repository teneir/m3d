import { initTabControl } from './modules/tabControl.js';
import { initMdfSheets } from './modules/mdfSheets.js';
import { initPieces } from './modules/pieces.js';
import { initAccessories } from './modules/accessories.js';
import { initCutPlan } from './modules/cutPlan.js';
import { initBudget } from './modules/budget.js';

document.addEventListener('DOMContentLoaded', function() {
    initTabControl();
    initMdfSheets();
    initPieces();
    initAccessories();
    initCutPlan();
    initBudget();
});
