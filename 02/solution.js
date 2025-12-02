const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const ranges = raw.split(",").map((v) => v.split("-").map(Number));

function isInvalid(n) {
  const s = n.toString();
  if (s.length % 2 !== 0) return false;
  const h = s.length / 2;
  const p = [s.slice(0, h), s.slice(h)];
  return p[0] === p[1];
}

function pt1() {
  const invalids = [];

  for (let r = 0; r < ranges.length; r++) {
    const lo = ranges[r][0];
    const hi = ranges[r][1];
    for (let i = lo; i <= hi; i++) {
      if (isInvalid(i)) invalids.push(i);
    }
  }

  console.log("part 1");
  console.log(invalids.reduce((a, b) => a + b, 0));
}

pt1();

// ============

// function divisors(n) {
//   const r = [];
//   // only check up to square root to omit repeating pairs
//   for (let i = 1; i * i <= n; i++) {
//     if (n % i === 0) {
//       r.push(i);
//       // push pair when not sqrt
//       if (i !== n / i) r.push(n / i);
//     }
//   }
//   return r.sort((a, b) => a - b);
// }

// function chunkStr(s, size) {
//   const o = [];
//   for (let i = 0; i < s.length; i += size) {
//     o.push(s.slice(i, i + size));
//   }
//   return o;
// }

// function isInvalid2(n) {
//   let valid = true;
//   // no need to check last divisor
//   const d = divisors(n).slice(0, -1);
//   const s = n.toString();
//   for (let i = 0; i < d.length; i++) {
//     const size = s.length / d[i];
//     const chunks = chunkStr(s, size);
//     if (chunks.every((c) => c === chunks[0])) valid = false;
//   }

//   return valid;
// }

function hasRepeatedPattern(s) {
  return (s + s).indexOf(s, 1) < s.length;
}

function pt2() {
  const invalids = [];

  for (let r = 0; r < ranges.length; r++) {
    const lo = ranges[r][0];
    const hi = ranges[r][1];
    for (let i = lo; i <= hi; i++) {
      if (hasRepeatedPattern(i.toString())) invalids.push(i);
    }
  }

  console.log("part 2");
  console.log(invalids.reduce((a, b) => a + b, 0));
}

pt2();
