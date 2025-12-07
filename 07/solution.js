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
const beamed = beam(raw)
  .split("\n")
  .map((r) => r.split(""));

let cnt = 0;
for (let y = 0; y < beamed.length; y++) {
  for (let x = 0; x < beamed[0].length; x++) {
    if (beamed[y - 1] && beamed[y][x]) {
      if (beamed[y][x] === SPLITTER && beamed[y - 1][x] === BEAM) {
        cnt += 1;
      }
    }
  }
}
console.log("pt 1");
console.log(cnt);

////
