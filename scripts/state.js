import {
    save,
    load
} from './storage.js';

let records =[];

//only fields a user can edit
const editableFields = ['description', 'amount', 'category', 'date'];

// init function that runs once the app starts
export async function initState() {
    const stored = load();

    if (stored.length > 0) {
        records = stored;
        return;
    }

    //try to catch starter data if drawer is empty
    try {
        const response = await fetch('seed.json');
        if (!response.ok) throw new Error(`seed.json returned status ${response.status}`);
        records = await response.json();
        save(records);
    } 
    catch (error) {
        console.error('could not load seed.json:', error);
        records = [];
    
    }
} 

// returns a copy
export function getAllRecords() {
    return [...records];
}

//makes id for record with the format rec_0001
function makeId() {
    const numbers = records.map((r) => parseInt(String(r.id).replace('rec_', ''), 10) || 0);
    const highest = Math.max(0, ...numbers);
    return `rec_${String(highest + 1).padStart(4, '0')}`;
}

//add record 
export function addRecord({ description, amount, category, date}) {
    const now = new Date().toISOString();
    const record = {
        id: makeId(),
        description,
        amount: number(amount),
        category,
        date,
        createAt: now,
        updatedAt: now,
    };
    records.push(record);
    save(records);
    return { ...record };
}

//update: change only what was edited, update only updateAt
export function updateRecord(is, changes) {
    const record = records.find((r) => r.id === id);
    if (!record)  //no record with that id
        return null;

    for (const field of editableFields) {
        if (field in changes) {
            record[field] = field === 'amount' ? Number(changes[field]) : changes[field];

        }
    }

    record.updateAt = new Date().toISOString();
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

