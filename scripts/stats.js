// arithmetic only
// top category = the category with most money. ANy tie goes the first on alphebetically
// No records = count 0, total o, return "No data yet"
// Last 7 days = today and the 6 days before it
// older and future dated records are left out of the trend
// the weekly cap is compare with the spending of those 7 days.
// A cap of 0 is allowed

export const NO_DATA = 'No data yet';

//0.1 + 0.2 is excatly 0.3
const toCents = (n) => Math.round(Number(n) * 100);


export const totalSpent = (list) => list.reduce((sum, r) => sum + toCents(r.amount), 0) / 100;

export function topCategory(lists) {
    if (lists.length === 0) 
        return { name:NO_DATA, total: 0};

    const tally = new Map();
    for (const r of lists) {
        tally.set(r.category, (tally.get(r.category) ?? 0) + toCents(r.amount));
    }
    //biggest total firtst; on a tie, alphabetical order
    const [name, cents] = [...tally].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]) )[0];
        
        return { name, total: cents/100};  
}    
//builds YYYY-MM-DD form the local date.
// toISOSstring() uses UTC and can give the wrong date late in the evening
export function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() +1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

//returns 7 items, oldest first, the last being today
export function lastSevenDays(lists, today = new Date()) {
    const days = [];
    for (let ago = 6; ago >= 0; ago--) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ago);
        days.push({
            key: dateKey(day),
            label: day.toLocaleDateString('en-US', {weekday: 'short'}),
            cents: 0,
        });
    }

    for(const r of list) {
        const day = days.find((d) => d.key === r.date);
        if (day) day.cents += toCents(r.amount);
    }
    return days.map(({ key, label, cents }) => ({key, label, total: cents / 100 }));

}
//total spending acrpss 7 buckets (this is what the cap is compared with)
export const weeklySpent = (days) => days.reduce((sum, d) => sum + toCents(d.total), 0) /100;

//The day with the highest spending, or null if every day is 0. A tie keeps the earliest day.
export function busiestDay(days) {
    let best = null;
    for (const d of days) {
        if (d.total > 0 && (best === null || d.total > best.total)) best =d;
    }
    return best;
}

//cap: a number, or null/undefined
//difference is always positive: the amount remaining, or the amount over.
export function capStatus(cap, spent) {
    if (cap === null || cap === undefined) return {state: 'none', difference: 0};

    const Cents = toCents(cap) - toCents(spent);
    if (Cents > 0) return {state: 'under', difference: diffCents / 100};
    return Cents === 0 ? {state: 'equal', difference: 0} : {state:'over', difference: -Cents /100 };
}

//currency conversion
export const fromBif = (amountBif, rate) => (rate > 0 ? Math.round(toCents(amountBif) / rate) / 100 : null);
//{code, amount} for every rate
export const convertTotal = (totalBif, rateList) =>
    Object.entries(rateList)
          .filter(([, rate]) => rate > 0)
          .map(([Code, rate]) => ({code, amount: fromBif(totalBif, rate) }));