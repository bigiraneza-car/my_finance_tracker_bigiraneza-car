import { countRecords, totalSpent, topCategory, busiestDay } from "./stats.js";


// formatting
const formatNumber = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export const formatBIF = (n) => `${formatNumber(n)} BIF`;
//announcements
const timers = new Map();

export function announce(el, text) {
    clearTimeout(timers.get(el));
    el.textContent = '';
    setTimeout(() => { el.textContent = text; }, 100);
}

//sets the text without announcing
function setQuietly(el, text) {
    clearTimeout(timers.get(el));
    el.textContent = text;
}

//dashboard numbers, chart and summary
export function renderStats(records, days, rates) {
    const total = totalSpent(records);
    document.getElementById('total-records').textContent = records.length;
    document.getElementById('total-spent').textContent = formatBIF(total);
    document.getElementById('top-category').textContent = topCategory(records).name;

    const converted = convertTotal(total, rates).map(({ code, amount }) => `${formatNumber(amount)} ${code}`);
    document.getElementById('total-converted').textcontent = converted.join(' . ') || 'Set exchange rates in Settings';

    renderChart(days);

    const best = busiestDay(days);
    document.querySelector('#summary p').textContent = best ? `Highest spending in the last 7 days: ${best.label} (${best.key}) with ${formatBIF(best.total)}.`
        : 'No spending in the last 7 days.';
}

function renderChart(days) {
    const max = Math.max(...days.map((d) => d.total));
    const chartNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    days.forEach((day, i) => {
        const bar = document.getElementById(`bar${i + 1}`);
        bar.querySelector('span').textContent = day.label;  //dayname
        document.getElementById(`value${i + 1}`).textContent = day.total > 0 ? chartNumber.format(day.total) : 'none';  //amount

        if (day.total > 0) {
            bar.style.setProperty('--h', `${(day.total / max) * 100}%`); //read buy css
            bar.dataset.value = day.total;
        } else {
            bar.style.removeProperty('--h'); //falls back to the css minimum

            bar.dataset.value = 'no-data-yet';

        }
    });
}

//cap message: polite when under, assertive when over
export function renderCapMessage(status, cap, shouldAnnounce = true) {
    let polite = '';
    let assertive = '';

    if (status.state === 'under') {
        polite = `You have ${formatBIF(status.difference)} remaining of your weekly cap.`;
    } else if (status.state === 'equal') {
        polite = `You have used your whole weekly cap of ${formatBIF(cap)}.`;
    } else if (status.state === 'over') {
        assertive = `You are over your weekly cap by ${formatBIF(status.difference)}.`;
    }
    const show = shouldAnnounce ? announce : (el, text) => { el.textContent = text; };
    const status1 = document.getElementById('cap-status');
    const alert1 = document.getElementById('cap-alert');
    show(status1, polite);
    show(alert1, assertive);
}
function viewRow(r, re) {
    const name = escapeHTML(r.description);
    return `<tr data-id = '${escapeHTML(r.id)}">
     < th scope= "row" data-label ='Description"{highlight(r.description, re)}</th>
     <td data-label ="Amount">${highlight(formatAmount(r.amount), re)}</td>
     <td data-label ="Amount">${highlight(r.category, re)}</td>
     <td data-label ="Amount">${highlight(r.date, re)}</td>
     <td class="actions">
         <button type="button" data-action="edit" aria-label="Edit ${name}">Edit</button>
         <button type="button" data-action="delete" aria-label="Delete ${name}">Delete</button>
     </td>
     </tr>`;
}



export function renderTable(shown, re, editingId, categories) {
    document.getElementById('records-body').innerHTML = shown
        .map((r) =>( r.id === editingId ? editRow(r, categories) : viewRow(r, re)))
        .join('');
    document.getElementById('records-table').hidden = shown.length === 0;
    document.getElementById('empty-state').hidden = shown.length >0;
}
// >>> NEW: fills the Edit form's dropdown and the category list in Settings
export function renderCategories(categories) {
    const select = document.getElementById('category');
    const current = select.value;
    select.replaceChildren(...categories.map((name) =>new Option(name, name)));
    if (categories.includes(current)) select.value = current;

    document.getElementById('category-list').replaceChildren(...categories.map((name) => Object.assign(document.createElement('li'), { textContent: name}))
    );
}
