import {
    save,
    load,
    loadCategories,
    saveCategories,
    loadRates,
    saveRates
} from './storage.js';

let records =[];

//categories and exchange rates
let categories = [];
let rates = {RWF: null, KES: null };

//only fields a user can edit
const editableFields = ['description', 'amount', 'category', 'date'];

// init function that runs once the app starts. It loads categories and rates and check if stored !== null
export async function initState() {
    categories = loadCategories();
    rates = loadRates();

    const stored = load();

    if (stored !== null) {
        records = stored;
        return;
    }

    //try to catch starter data if drawer is empty
    try {
        const response = await fetch('seed.json');
        if (!response.ok) throw new Error(`seed.json returned status ${response.status}`);
        const seed = await response.json();
        records = Array.isArray(seed) ? seed : [];
        save(records);
    } 
    catch (error) {
        console.error('could not load seed.json:', error);
    }
} 

// returns a copy of each record
export const getAllRecords = () => records.map((r) => ({...r }));


//makes id for record with the format rec_0001
function makeId() {
    const numbers = records.map((r) => parseInt(String(r.id).replace('rec_', ''), 10) || 0);
    const highest = Math.max(0, ...numbers);
    return `rec_${String(highest + 1).padStart(4, '0')}`;
}

//add record 
export function addRecord({ description, amount, category, date}) {
    const now = new Date().toISOString();
    records.push({
        id: makeId(),
        description,
        amount: Number(amount),
        category,
        date,
        createdAt: now,
        updatedAt: now,
    });
    save(records);
    return { ...records};
}

//update: change only what was edited, update only updateAt
export function updateRecord(id, changes) {
    const record = records.find((r) => r.id === id);
    if (!record)  //no record with that id
        return null;

    for (const field of editableFields) {
        if (field in changes) {
            record[field] = field === 'amount' ? Number(changes[field]) : changes[field];

        }
    }

    record.updatedAt = new Date().toISOString();
    save(records);
    return { ...record };
}

// delete and build a new list without that id
export function deleteRecord(id) {
    const before = records.length;
    records = records.filter((r) => r.id !== id);
    save(records);
    return records.length < before; //true if something was really remove
}

