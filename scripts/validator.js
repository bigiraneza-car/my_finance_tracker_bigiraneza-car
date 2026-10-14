/* regex for date validation ^\d{4}-(0[1-9]|1[0-2])-([0][1-9]|[1-2]\d|3[01])$  
numeric field: ^(0[1-9]\d*)(\.\d{1,2})?$
Category/tag /^[A-Za-z]+(?:[ -][A-Za-z]+)$/*/

export const patterns = {
    //date validation REGEX
    date: /^\d{4}-(0[1-9]|1[0-2])-([0][1-9]|[1-2]\d|3[01])$/,
    //category validation REGEX
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)$/,
    //amount validation regex
    amount: /^(0[1-9]\d*)(\.\d{1,2})?$/,
    //description validation REGEX
    description: /^\S(?:.*\S)?$/,
    //doublespaces validation regex
    doubleSpaces: /\s{2,}/,
    //duplicate validation regex
    duplicateWord: /\b(\w+)\s+\1\b/i,
};

const okay = () => ({ valid: true, message: '' });
const fail = (message) => ({ valid: false, message });

//description function

export function validateDescription(value){
    if (value === '') 
        return fail('Enter a description, for example: lunch at cafeteria.');
    if (!patterns.description.test(value)) 
        return fail('Remove the spaces at the start or end of the description.');
    if (!patterns.doubleSpaces.test(value)) 
        return fail('use single spaces between words.');
    return okay();
}

//// -- advanced rule: repeated word
export function validateNoDuplicateWords(value) {
    const match = value.match(patterns.duplicateword);
    if (match)
        return fail('the word "${match[1]}" is repeated. Remove one of them.');
    return okay();
}

// description field uses the basic rule first and then the advanced one.

export function vlaidateItem(value) {
    const basic = validateDescription(value);
    return basic.valid ? validateNoDuplicateWords(value): basic;
}

//-- amount

export function validateAmount(value) {
    if (value == '')
        return fail('Enter an amount, e.g: 1000');
    if (!patterns.amount.test(value))
        return fail('Amount must be a number like 3000, no leading zeros, and up to 2 decimals.');
    return okay();
}

//--date
export function validateDate(value) {
    if (value === '')
        return fail('choose a date');
    if (!patterns.date.test(value))
        return fail('Use the format YYYY-MM-DD, for example 2025-09-29.');

    return okay();
}

// category
export function validateCategory(value) {
    if (value=== '')
        return fail('Enter or choose a category.');
    if(!patterns.category.test(value)) {
        return fail('use letters only, with dingle spaces or hyphens between words (for example fast food).');
    return okay;
    }
}
