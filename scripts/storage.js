const KEYS = {records:'aouii:records', cap:'aouii:cap', rates: 'aouii:rates', categories: 'aouii:categories' };
//category list
export const DEFAULT_CATEGORIES = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];

//to let main.js decide how a failed save is shown

let onError = () => {};
export const onSaveError = (fn) => { onError = fn; };
 //one reader and writer with its own try/catch
function read(Key, fallback) {
    try {
        const text = localStorage.getItem(Key);
        return text === null ? fallback : JSON.parse(text);
    } catch {
        return fallback;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }catch (error) {
        onError(error);
    }
}


// This function will load back the saved records  
export function load() {
    const data = read(KEYS.records, null);
        return Array.isArray(data) ? data : null;
}
// change list into text and save it 
export const  save = (records) => write(KEYS.records, records);



//return a number or null if there is no cap
export const loadCap = () => {
    const value = read(KEYS.cap, null);
    return typeof value === 'number' ? value : null;
};
export const saveCap = (cap) => write(KEYS.cap, cap);

// exchange rates RWF and KES

export function loadRates() {
    const data = read(KEYS.rates, null);
    return {RWF: data?.RWF > 0 ? data.RWF : null, KES: data?.KES > 0 ? data.KES : null };
}

export const saveRates = (rates) => write(KEYS.rates, rates);

//add: category list
export function loadCategories() {
        const data = read(KEYS.categories, null);
        return Array.isArray(data) && data.length > 0 ? data : [...DEFAULT_CATEGORIES];
}
export const saveCategories = (categories) => write(KEYS.categories, categories);