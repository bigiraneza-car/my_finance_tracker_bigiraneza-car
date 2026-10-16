// scripts/main.js -entry point ()

import {
    validateItem,
    validateAmount,
    validateCategory,
    validateDate,
} from './validator.js';
import { initState, addRecord, getAllRecords } from './state.js';

 // error UI helpers 
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error1 = document.getElementById(`${fieldId}-error`);
    error1.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
}
 
// show or clears the error and return true/false
function checkField({id, validate }) {
    const { valid, message } = validate(document.getElementById(id).value);
    showError(id, valid ? '': message);
    return valid;
}

function announce( el, text) {
    el.textContent = '';
    setTimeout( () => { el.textContent = text; }, 100);
}


// function reused by every form that needs validation 
function setupForm({ form, fields, statusId, successMessage, onValid }) {
    if (!form)
        return;
    const status1 = document.getElementById(statusId);

    //for fields that has an error becomes valid, clear its error.
    fields.forEach((field) => {
        document.getElementById(field.id).addEventListener('input', (event) =>{
            if (event.target.hasAttribute('aria-invalid')) 
                checkField(field);
        });
        });
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();        //stop the page reload
        status1.textContent = '';         //remove an old "saved" message

        const results = fields.map((field)  => checkField(field));  //check all, so every error shows at once

        const firstInvalid = fields.find((_,i) => !results[i]);

        if (firstInvalid) {
            document.getElementById(firstInvalid.id).focus();  //keyboard users land on the problem
            return;
        }
        if (onValid) onValid();  //M4: save the record
        announce(status1, successMessage);
        form.reset();
        document.getElementById(fields[0].id).focus();
    });

}

//start the app: load the save records
await initState();
// 
console.log(getAllRecords());

//Edit form: description, amount, category, date...
setupForm({
    form: document.querySelector('#add-form form'),
    fields: [
        { id: 'item', validate: validateItem },
        { id: 'amount', validate: validateAmount},
        { id:'category', validate:validateCategory},
        { id: 'date', validate: validateDate},
    ],
    statusId: 'edit-status',
    successMessage: 'Expense saved',
    onValid: () => {
        //read the four values and hand them to the records variable
        addRecord({
            description: document.getElementById('item').value,
            amount: document.getElementById('amount').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value,
        });
    },
});
// settings: new category
setupForm({
    form: document.querySelector('#editor form'),
    fields: [{id: 'new-category', validate: validateCategory }],
    statusId: 'new-category-status',
    successMessage: 'Category is valid.' 
});