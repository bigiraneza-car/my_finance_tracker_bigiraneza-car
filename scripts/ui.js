import { countRecords, totalSpent, topCategory, busiestDay } from "./stats.js";

// formatting
const formatNumber = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export const formatBIF = (n) => `${formatNumber(n)} BIF`;
//announcements
const timers = new Map();

export function announce(el, text) {
    clearTimeout(timers.get(el));
    el.textContent = '';
    if (text === '') return;
    timers.set(el, setTimeout(() => { el.textContent = text; }, 100));
}

//sets the text without announcing
function setQuietly(el, text) {
    clearTimeout(timers.get(el));
    el.textContent = text;
}

//dashboard numbers, chart and summary
export function renderStats(records, days) {
    document.getElementById('total-records').textContent = String(countRecords(records));
    document.getElementById('total-spent').textContent = formatBIF(totalSpent(records));
    document.getElementById('top-category').textContent = topCategory(records).name;

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

        document.getElementById(`value${i + 1}`).textContent =
            day.total > 0 ? chartNumber.format(day.total) : 'none';  //amount
        if (day.total > 0 && max > 0) {
            bar.style.setProperty('--h', `${(day.total / max) * 100}%`); //read buy css
            bar.dataset.value = String(day.total);
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
    const status1 = document.getElementById('cap-status');
    const alert1 = document.getElementById('cap-alert');
    const show = shouldAnnounce ? announce : setQuietly;

    show(status1, polite);
    show(alert1, assertive);
}