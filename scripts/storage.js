const KEY = 'aouii:records';

//to let main.js decide how a failed save is shown

let saveErrorHandler = null;
export function onSaveError(fn) {saveErrorHandler = fn; }
 //wrap setItem in try/catch
function safeSet(Key, text) {
    try {
        localStorage.setItem(Key, text);
        return true;
    } catch (error) {
        console.error('Could not save to localStorage:', error);
        if (saveErrorHandler) saveErrorHandler(error);
        return false;
    }
}
// change list into text and save it 
export function save(records) {
    return safeSet(KEY, JSON.stringify(records));
}
// This function will load back the saved records  
export function load() {
    const text = localStorage.getItem(KEY);
    if (text === null)  //if nothing is saved yet, return null
        return null;

    try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : null;

    } catch {
        return null;    //catch damaged text to avoid crashing the app
    }
}

//cap saved under its own key separate from the records
const CAP_KEY = 'aouii:cap';

//cap is a number or null
export function saveCap(cap) {
    if(cap === null) localStorage.removeItem(CAP_KEY);
    else safeSet(CAP_KEY, String(cap));
}

//return a number or null if there is no cap
export function loadCap() {
    const text = localStorage.getItem(CAP_KEY);
    if ( text === null) return null;
    const value = Number(text);
    return Number.isFinite(value) && (value >= 0) ? value : null;
}

// exchange rates
const RATES_KEY = 'aouii:rates';

export function saveRates(rates) {
    return safeSet(RATES_KEY, JSON.stringify(rates));
}

export function loadRates() {
    const empty = { RWF: null, KES: null };
    try {
        const data = JSON.parse(localStorage.getItem(RATES_KEY) ?? 'null');
        if (!data || typeof data !== 'object') return empty;
        const clean = (v) => (typeof v === 'number' && v > 0 ? v : null);
        return { RWF:clean(data.RWF), KES:clean(data.KES) };
    } catch {
        return empty;
    }
}

//add: category list
const CATEGORIES_KEY = 'aouii:categories';
export const DEFAULT_CATEGORIES = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];

export function saveCategories(categories) {
    return safeSet(CATEGORIES_KEY, JSON.stringify(categories));
}

//falls back to defaults if nothing is saved or if the saved value is damaged
export function loadCategories() {
    try {
        const data = JSON.parse(localStorage.getItem(CATEGORIES_KEY) ?? 'null');
        if (Array.isArray(data) && data.length > 0 && data.every((c) => typeof c === 'string')) 
            return data;
    }catch {
        //fall through to the defaults
    }
    return [...DEFAULT_CATEGORIES];
}