const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */
const rows = raw
  .trim()
  .split("\n")
  .map((line) => line.trim().split(/\s+/));

const inp = rows[0].map((_, i) => rows.map((row) => row[i]));

// ======
const results = [];
for (let i = 0; i < inp.length; i++) {
  let r;
  const op = inp[i][inp[i].length - 1];
  const nums = inp[i].slice(0, inp[i].length - 1).map(Number);
  switch (op) {
    case "+":
      r = nums.reduce((a, b) => a + b, 0);
      break;
    case "*":
      r = nums.reduce((a, b) => a * b, 1);
      break;
  }
  results.push(r);
}

console.log("pt1");
console.log(results);

// ----------------

const inp2 = raw.split("\n").map((r) => r.split(""));
const cols = inp2[0].map((_, i) => inp2.map((row) => row[i]));

// add column w/ all spaces to trigger final problem
cols.push(Array(inp2.length).fill(" "));

const results2 = [];
let currentNums = [];
let currentOp = null;

for (let i = 0; i < cols.length; i++) {
  const col = cols[i];
  const op = col[col.length - 1];
  const num = Number(
    col
      .slice(0, col.length - 1)
      .join("")
      .trim()
  );

  // all spaces - finish current prob
  if (num === 0) {
    if (currentNums.length > 0 && currentOp) {
      let result;
      if (currentOp === "+") {
        result = currentNums.reduce((a, b) => a + b, 0);
      } else {
        result = currentNums.reduce((a, b) => a * b, 1);
      }
      results2.push(result);
      currentNums = [];
      currentOp = null;
    }
  } else {
    currentNums.push(num);
    if (op !== " ") currentOp = op;
  }
}

console.log("p2");
console.log(results2.reduce((a, b) => a + b, 0));
