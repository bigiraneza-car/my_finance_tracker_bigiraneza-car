const KEY = 'aouii:records';
// change list into text and save it 
export function save(records) {
    localStorage.setItem(KEY, JSON.stringify(records));
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
    else localStorage.setItem(CAP_KEY, String(cap));
}

//return a number or null if there is no cap
export function loadCap() {
    const text = localStorage.getItem(CAP_KEY);
    if ( text === null) return null;
    const value = Number(text);
    return Number.isFinite(value) && (value >= 0) ? value : null;
}
