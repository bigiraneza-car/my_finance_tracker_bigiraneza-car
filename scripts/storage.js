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
