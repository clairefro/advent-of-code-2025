const load = require("../util/load");
const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */
// Parse input into an array of 3D points: [[x,y,z], ...]
const coords = raw.split("\n").map((n) => n.split(",").map(Number));

// Distance function: Euclidean distance between two 3D points
function dist([ax, ay, az], [bx, by, bz]) {
  // (dx^2 + dy^2 + dz^2)^(1/2)
  return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2);
}

// ---------------------------------------------------------------------------
// Part 1 helper: find the k (default 1000) closest unordered pairs (i < j)
// We want the 1000 smallest distances. Naively generating all pairs is O(n^2).
// To avoid storing all O(n^2) pairs we maintain a fixed-size max-heap of the
// smallest k seen so far: whenever the heap has k items and a new distance is
// smaller than the heap maximum, we pop the max and insert the new item.
// After scanning all pairs the heap contains the k smallest pairs (unsorted);
// we pop them and sort ascending before returning.
//
// A max-heap stores the largest element at the root so we can quickly compare
// the current largest of the top-k with a candidate.
function connect(coords, limit = 1000) {
  const n = coords.length;
  if (n < 2) return [];

  // Simple array-backed max-heap implementation specialized for objects
  // with numeric `d` property (distance). We only implement the methods we
  // need: push, pop, peek, size.
  class MaxHeap {
    constructor() {
      this.data = [];
    }
    size() {
      return this.data.length;
    }
    peek() {
      return this.data[0];
    }
    push(item) {
      this.data.push(item);
      this._siftUp(this.data.length - 1);
    }
    pop() {
      // remove and return root (largest element)
      const top = this.data[0];
      const last = this.data.pop();
      if (this.data.length) {
        this.data[0] = last;
        this._siftDown(0);
      }
      return top;
    }
    _siftUp(i) {
      // Move element at index i up until heap property holds
      while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        if (this.data[p].d >= this.data[i].d) break; // parent already larger
        [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
        i = p;
      }
    }
    _siftDown(i) {
      // Move element at index i down until heap property holds
      const n = this.data.length;
      while (true) {
        let l = 2 * i + 1,
          r = l + 1,
          largest = i;
        if (l < n && this.data[l].d > this.data[largest].d) largest = l;
        if (r < n && this.data[r].d > this.data[largest].d) largest = r;
        if (largest === i) break;
        [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
        i = largest;
      }
    }
  }

  const heap = new MaxHeap();

  // iterate over all unordered pairs (i < j)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = dist(coords[i], coords[j]);
      const item = { i, j, d };
      if (heap.size() < limit) {
        // warm up the heap until it has `limit` items
        heap.push(item);
      } else if (d < heap.peek().d) {
        // new candidate is smaller than current largest in heap: replace root
        heap.pop();
        heap.push(item);
      }
      // otherwise the candidate is larger than the top-k we already have: skip
    }
  }

  // collect items from heap and sort ascending by distance
  const out = [];
  while (heap.size()) out.push(heap.pop());
  out.sort((a, b) => a.d - b.d);
  return out;
}

// ---------------------------------------------------------------------------
// Disjoint-set (union-find) data structure with union by size + path compression
// Purpose: maintain a partition of the nodes into components (circuits). We
// perform unions when we connect two boxes; `find` returns a component id.
// This structure gives ~amortized O(alpha(n)) per operation, effectively
// constant for practical n.
function makeUF(n) {
  // parent[x] = parent index; a root points to itself
  const parent = Array.from({ length: n }, (_, i) => i);
  // size[root] = number of nodes in the root's component (only accurate for roots)
  const size = Array(n).fill(1);

  // find with path compression: make nodes on the path point directly to root
  function find(a) {
    if (parent[a] === a) return a;
    parent[a] = find(parent[a]);
    return parent[a];
  }

  // union by size: attach smaller root under larger root to keep trees shallow
  function union(a, b) {
    let ra = find(a),
      rb = find(b);
    if (ra === rb) return false; // already in same component
    if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    size[ra] += size[rb];
    return true;
  }

  return { find, union, parent, size };
}

// ---------------------- main: part 1 (1000 closest pairs) --------------------
// Find the 1000 closest pairs (or fewer if there are less pairs total)
const closest = connect(coords, 1000);
console.log("found pairs:", closest.length);
console.log("closest 10 pairs:", closest.slice(0, 10));

// Use union-find to process the pairs in ascending order; unions are idempotent
// if two nodes are already connected. After processing the k pairs, read off
// component sizes and multiply the top 3.
const uf = makeUF(coords.length);
for (const p of closest) uf.union(p.i, p.j);

const compSizes = new Map();
for (let i = 0; i < coords.length; i++) {
  const r = uf.find(i);
  compSizes.set(r, (compSizes.get(r) || 0) + 1);
}
const sizes = Array.from(compSizes.values()).sort((a, b) => b - a);

// multiply top 3 sizes (use BigInt for safety)
const top3 = sizes.slice(0, 3);
let product = 1n;
for (const s of top3) product *= BigInt(s);

console.log("top 3 sizes:", top3);
console.log("answer (product):", product.toString());

// ---------------------- part 2 (connect until single component) -------------
// This function builds all pairs, sorts them by distance, and unions until the
// number of components becomes 1. The pair that caused the final union is
// returned. This is the "last connection" needed to join everything.
function findLastConnectingPair(coords) {
  const n = coords.length;
  if (n < 2) return null;

  // Build all unordered pairs (i<j) with their distances. This is O(n^2)
  // time and memory, but for typical puzzle sizes it's fine.
  const pairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ i, j, d: dist(coords[i], coords[j]) });
    }
  }

  // Sort by distance ascending so we process closest-first
  pairs.sort((a, b) => a.d - b.d);

  const uf2 = makeUF(n);
  let components = n;
  for (const p of pairs) {
    const ri = uf2.find(p.i);
    const rj = uf2.find(p.j);
    if (ri !== rj) {
      uf2.union(p.i, p.j);
      components -= 1;
      // When components reaches 1 we've just performed the final union
      if (components === 1) return p;
    }
  }
  return null;
}

const lastPair = findLastConnectingPair(coords);
if (lastPair) {
  const xi = coords[lastPair.i][0];
  const xj = coords[lastPair.j][0];
  console.log("part2 last connecting pair:", lastPair, "x product:", xi * xj);
} else {
  console.log("part2: no connecting pair found");
}
