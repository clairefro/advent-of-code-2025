const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const stripped = raw.replace(/;/g, "");

const ranges = stripped
  .split("\n\n")[0]
  .split("\n")
  .map((l) => l.split(/\s?-\s?/).map(Number));

const ings = stripped.split("\n\n")[1].split("\n").map(Number);

function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const m = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const [lo, hi] = sorted[i];
    const last = m[m.length - 1];
    if (lo <= last[1] + 1) {
      last[1] = Math.max(last[1], hi); // extend last range's end to max of both ends
    } else {
      m.push([lo, hi]); // no overlap = add as new range
    }
  }
  return m;
}

function isInRange(n, r) {
  return n >= r[0] && n <= r[1];
}

function pt1() {
  // mergeRanges consolidates ranges count from 182 -> 79 (-56.6%) in my input
  const m = mergeRanges(ranges);

  let fresh = 0;
  for (let i = 0; i < ings.length; i++) {
    for (let k = 0; k < m.length; k++) {
      if (isInRange(ings[i], m[k])) {
        fresh += 1;
        continue;
      }
    }
  }

  console.log("pt 1");
  console.log(fresh);
}

pt1();

// ========

function pt2() {
  const r = mergeRanges(ranges);
  let c = 0;
  for (let i = 0; i < r.length; i++) {
    c += r[i][1] - r[i][0] + 1;
  }
  console.log("pt2");
  console.log(c);
}

pt2();
