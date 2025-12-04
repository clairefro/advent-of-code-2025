const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const rows = raw.split("\n").map((r) => r.split(""));

const PAPER = "@";

const offsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function run(rows) {
  let c = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] !== PAPER) continue;
      let a = 0;
      for (let o = 0; o < offsets.length; o++) {
        const [dx, dy] = offsets[o];
        if (
          y + dy < 0 ||
          y + dy >= rows.length ||
          x + dx < 0 ||
          x + dx >= rows[y + dy].length
        )
          continue; // out of bounds = accessible
        if (rows[y + dy][x + dx] === PAPER) a += 1;
      }
      if (a < 4) c += 1;
    }
  }
  return c;
}

console.log("pt 1");
console.log(run(rows));

// =====

function rm(rows) {
  let c = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] !== PAPER) continue;
      let a = 0;
      for (let o = 0; o < offsets.length; o++) {
        const [dx, dy] = offsets[o];
        if (
          y + dy < 0 ||
          y + dy >= rows.length ||
          x + dx < 0 ||
          x + dx >= rows[y + dy].length
        )
          continue;
        if (rows[y + dy][x + dx] === PAPER) a += 1;
      }
      if (a < 4) {
        c += 1;
        rows[y][x] = "X";
      }
    }
  }
  return c;
}

function run2(rows) {
  let mut = [...rows];
  let c = 0;
  let running = true;
  let papaP = 0;
  while (running) {
    const _c = rm(mut);
    c += _c;
    const p = mut
      .map((r) => r.join(""))
      .join("")
      .match(/@/g).length;
    if (p === papaP) running = false;
    papaP = p;
  }
  return c;
}

console.log("pt 2");
console.log(run2(rows));
