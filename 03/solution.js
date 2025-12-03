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

const j = [];
for (let i = 0; i < banks.length; i++) {
  j.push(rateJoltage(banks[i]));
}

console.log("pt 1");
console.log(j.reduce((a, b) => a + b, 0));

// ============

const J_SIZE = 12;

function rankDangerousJoltage(bank) {
  const js = Array(J_SIZE).fill(0);
  let nxtI = 0;
  let lstK = 0;

  const bs = bank.split("").map(Number);

  // find index and val of first + highest # in range k - (J_SIZE - i)
  // set index of last find (k)
  for (let i = 0; i < js.length; i++) {
    for (let k = nxtI; k <= bs.length - (J_SIZE - i); k++) {
      if (bs[k] > js[i]) {
        js[i] = bs[k];
        lstK = k;
      }
    }
    nxtI = lstK + 1;
  }
  return Number(js.join(""));
}

const jd = [];
for (let i = 0; i < banks.length; i++) {
  jd.push(rankDangerousJoltage(banks[i]));
}

console.log("pt 2");
console.log(jd.reduce((a, b) => a + b, 0));
