//how many BIF equal 1 unit of the other currency
// BIF into rwf : RWF = BIF / RATE ( 1000bif at 3.9 = 256.41rwf)
const toCents = (n) => Math.round(Number(n) * 100);


function toRate(rate) {
    const n = Number(rate);
    return Number.isFinite(n) && n > 0 ? n: null;
}
//returns the converter amount rounded to 2 decimals or null if the rate is missing

export function fromBif( amountBif, rate) {
    const r = toRate(rate);
    if (!(r > 0))
        return null;
    return Math.round(toCents(amountBif) / r) / 100;
}

//takes object of rates and return code: rate, e.g: RWF:3.9

export function convertTotal(totalBif, rates) {
    return Object.entries(rates)
    .filter (([, rate]) => toRate(rate) > 0)
    .map(([code, rate]) => ({code, amount: fromBif(totalBif, rate) })); 
}