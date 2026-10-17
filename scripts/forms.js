import { announce } from "./ui.js";

//writes message into fieldId-error and flags the input.
export function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error1 = document.getElementById(`${fieldId}-error`);
    error1.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
}

//validate one field, shows or clears its error, returns true/false
export function checkField({ id, validate }) {
    const {valid, message } = validate(document.getElementById(id).value);
    showError(id, valid ? '' : message);
    return valid;
}

//reused by every form that needs valdation
 export function setupForm({ form, fields, statusId, successMessage, onValid, keepValues = false}) {
    if (!form) return;
    const status1 = document.getElementById(statusId);

    //when a field has an error becomes valid, clear its error
    fields.forEach((field) => {
        document.getElementById(field.id).addEventListener('input', (event) => {
            if (event.target.hasAttribute('aria-invalid')) 
                checkField(field);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();   //stop the page to reload
        status1.textContent = ''; //remove an old saved message

        const results = fields.map((field) => checkField(field)); //check all, to see every error at once
        const firstInvalid = fields.find((_, i) => !results[i]);

        if (firstInvalid) {
            document. getElementById(firstInvalid.id).focus(); //for keyboard user to land on the problem
            return;
        }

        if (onValid) onValid();
        announce(status1, successMessage);
        if(!keepValues) {
            form.reset();
            document.getElementById(fields[0].id).focus();
        }
    });
 }