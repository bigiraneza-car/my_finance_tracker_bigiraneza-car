// scripts/main.js -entry point ()

import {
    validateItem,
    validateAmount,
    validateCategory,
    validateDate,
} from './validator.js';

 // error UI helpers 
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error1 = document.getElementById('${fieldId}-error');
    error1.textcontent = message;
    if (message) input.setAttribute('arai-invalid', 'true');
    else input.removeAttribute('aria-invalid');
}
 
// show or clears the error and return true/fasle
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
function setupForm({ form, fields, statusId, sucessMessage }) {
    if (!form)
        return;
    const status1 = document.getElementById(statusId);

    //for fields that has an error becomes valid, clear its error.
    fields.forEach((field) => {
        document.getElementById(field.id).addEventListener('input', (event) =>{
            if (event.target.hasAttribut('aria-invalid')) 
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

        
    })

}