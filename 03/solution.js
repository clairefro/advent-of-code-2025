const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const banks = raw.split("\n");

function rateJoltage(bank) {
  let t = 0,
    o = 0;
  const batteries = bank.split("").map(Number);
  for (let i = 0; i < batteries.length; i++) {
    const b = batteries[i];
    if (b > t && i < batteries.length - 1) {
      t = b;
      o = 0; // reset o
    } else if (b > o) {
      o = b;
    }
  }
  return Number("" + t + o);
}

const joltages = [];
for (let i = 0; i < banks.length; i++) {
  joltages.push(rateJoltage(banks[i]));
}

console.log("pt 1");
console.log(joltages.reduce((a, b) => a + b, 0));

// ============
