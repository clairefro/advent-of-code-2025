const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const BEAM = "|";
const SPLITTER = "^";
const START = "S";

function beam(input) {
  const rows = input.split("\n").map((r) => r.split(""));
  const width = rows[0].length;
  let startRow = -1;

  for (let y = 0; y < rows.length; y++) {
    // find S, beam directly below
    if (startRow < 0) {
      const s = rows[y].indexOf(START);
      if (s > 0 && rows[y + 1] && rows[y + 1][s] !== SPLITTER) {
        rows[y + 1][s] = BEAM;
        startRow = y;
      }
    } else {
      // check above and mark directly below
      for (let x = 0; x < width; x++) {
        if (rows[y - 1] && rows[y - 1][x] === BEAM) {
          // beam hits splitter - split left and right
          if (rows[y][x] === SPLITTER) {
            if (x - 1 >= 0) rows[y][x - 1] = BEAM;
            if (x + 1 < width) rows[y][x + 1] = BEAM;
          } else {
            // beam continues down
            rows[y][x] = BEAM;
          }
        }
      }
    }
  }

  return rows.map((r) => r.join("")).join("\n");
}

// console.log(beam(raw));
const beamed = beam(raw);

const split = beamed.split("\n").map((r) => r.split(""));

let splitterCount = 0;
for (let y = 0; y < split.length; y++) {
  for (let x = 0; x < split[0].length; x++) {
    if (split[y - 1] && split[y][x]) {
      if (split[y][x] === SPLITTER && split[y - 1][x] === BEAM) {
        splitterCount += 1;
      }
    }
  }
}
console.log("pt 1");

console.log(beam(raw));
console.log(splitterCount);

// ======

function compress(input) {
  return input
    .split("\n")
    .filter((row) => row.includes(SPLITTER) || row.includes(START))
    .join("\n");
}

function countTimelinesCompressed(input) {
  const compressed = compress(input);
  const rows = compressed.split("\n").map((r) => r.split(""));
  const H = rows.length;
  const W = rows[0].length;

  const startRow = rows.findIndex((r) => r.includes(START));
  if (startRow === -1) throw new Error("Start not found in compressed input");
  const startX = rows[startRow].indexOf(START);

  // counts vector
  let counts = Array(W).fill(0n);
  counts[startX] = 1n;

  for (let i = startRow + 1; i < H; i++) {
    const row = rows[i];
    const newCounts = Array(W).fill(0n);
    for (let x = 0; x < W; x++) {
      const ways = counts[x];
      if (ways === 0n) continue;
      if (row[x] === SPLITTER) {
        if (x - 1 >= 0) newCounts[x - 1] += ways;
        if (x + 1 < W) newCounts[x + 1] += ways;
      } else {
        newCounts[x] += ways;
      }
    }
    counts = newCounts;
  }

  return counts.reduce((a, b) => a + b, 0n);
}

console.log("pt2");
console.log(
  "routes (compressed) for input:",
  countTimelinesCompressed(raw).toString()
);
