const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const ins = raw.split("\n").map((i) => {
  const [, l, d] = i.match(/([RL])(\d+)/);
  return l === "R" ? parseInt(d) : parseInt(d) * -1;
});

const LOCK_SIZE = 100;

const vals = [50];

for (let i = 0; i < ins.length; i++) {
  const cur = vals[vals.length - 1];
  const nxt = (cur + ins[i] + LOCK_SIZE) % LOCK_SIZE;
  vals.push(nxt);
}

console.log("part 1");
console.log(vals.filter((v) => v === 0).length);

// =================

let zeros = 0;
const vals2 = [50];

for (let i = 0; i < ins.length; i++) {
  const cur = vals2[vals2.length - 1];
  const tar = ins[i];

  // when moving L (negative) shift by -1 so landing exactly on 0 is included
  const a = tar > 0 ? cur : cur - 1;
  const b = tar > 0 ? cur + tar : cur + tar - 1;
  zeros += Math.abs(Math.floor(b / LOCK_SIZE) - Math.floor(a / LOCK_SIZE));

  const nxt = (((cur + tar) % LOCK_SIZE) + LOCK_SIZE) % LOCK_SIZE;
  vals2.push(nxt);
}

console.log("part 2");
console.log(zeros);
