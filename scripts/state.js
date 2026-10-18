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
    return `rec_${String(Math.max(0, ...numbers) + 1).padStart(4, '0')}`;
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
    newCopy = { ...records}
    return newCopy;
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
    records = records.filter((r) => r.id !== id);
    save(records);
}

//used by the import to replace the whole list
export function replaceAllRecords(newRecords) {
    records = [...newRecords];
    save(records);
}
//sorting for the records table
const sorters = {
    'date-desc': (a, b) => b.date.localeCompare(a.date),
    'date-asc': (a, b) => a.date.localeCompare(b.date),
    'description-asc': (a, b) => a.description.localeCompare(b.description, undefined, {sensitivity: 'base'}),
    'description-desc': (a, b) => b.description.localeCompare(a.description, undefined, {sensitivity: 'base'}),
    'amount-asc': (a, b) => a.amount - b.amount,
    'amount-desc': (a, b) => b.amount - a.amount,
};

export const sortRecords = (list, key) => [...list].sort(sorters[key]);

// categories and exchange rate
export const getCategories = () => [...categories];
export const hasCategory = (name) => categories.some((c) => c.toLowerCase() ===  name.toLowerCase());

export function addCategory(name) {
    if (hasCategory(name))
        return;
    categories.push(name);
    saveCategories(categories);
}
export const addMissingCategories = (list) => list.forEach((r) => addCategory(r.category)); //after an import

export const getRates = () => ({...rates});
export function setRates(newRates) {
    rates = newRates;
    saveRates(rates);
}


