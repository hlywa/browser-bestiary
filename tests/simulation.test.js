// Run locally with: node tests/simulation.test.js
// No browser, p5 installation, or external test package required.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const ordered = [
  "js/environment.js",
  "js/creatures.js",
  "js/experiments.js",
  "js/bestiary.js",
  "sketch.js"
];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sources = ordered.map(file => fs.readFileSync(path.join(root, file), "utf8"));

for (const [i, file] of ordered.entries()) {
  assert.doesNotThrow(() => new vm.Script(sources[i], {filename: file}),
    file + " should parse");
  assert.ok(html.includes('src="' + file + '?'), file + " must be loaded");
}
const indices = ordered.map(file => html.indexOf('src="' + file + '?'));
assert.deepEqual([...indices].sort((a, b) => a - b), indices,
  "scripts must be loaded in dependency order");

// Evaluate the exact browser scripts in one context, minus p5/UI execution.
const context = vm.createContext({Float32Array, Math, console});
sources.forEach((source, i) => vm.runInContext(source, context, {filename: ordered[i]}));
const run = expression => vm.runInContext(expression, context);
for (const name of [
  "setup", "draw", "beginStudy", "updateAgent", "updateAfterling",
  "updateEcologyAgent", "configurePoem", "renderEntries", "replayFromStart"
]) assert.equal(run('typeof ' + name), "function", name + " must exist");

function approx(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 0.00001,
    label + ": expected " + expected + ", got " + actual);
}

// Center impulse: mass spreads to its four immediate neighbors, not diagonal.
run("traceField.fill(0); traceField[10 * TRACE_COLS + 10] = 1; updateTraceField();");
const measure = run(`(() => {
  const i = 10 * TRACE_COLS + 10;
  return [traceField[i], traceField[i - 1], traceField[i + 1],
    traceField[i - TRACE_COLS], traceField[i + TRACE_COLS],
    traceField[i + TRACE_COLS + 1], traceField.reduce((a,b)=>a+b,0)];
})()`);
assert.ok(measure[0] < 1 && measure[0] > 0);
assert.ok(measure.slice(1,5).every(v => v > 0));
assert.equal(measure[5], 0, "a single local step should not reach diagonals");
approx(measure[6], 0.994, "one-step retained mass");

// No-flux boundaries: mass at a corner stays in the grid, apart from decay.
run("traceField.fill(0); traceField[0] = 1; updateTraceField();");
approx(run("traceField.reduce((a,b)=>a+b,0)"), 0.994, "corner retained mass");
assert.ok(run("traceField[1] > 0 && traceField[TRACE_COLS] > 0"));

// Erasure empties both local and diffused history, new deposit still works.
run("traceField.fill(0); depositTrace(220, 220, 0.5);");
assert.ok(run("traceAt(220,220)") > 0);
run("traceField.fill(0);");
assert.equal(run("traceAt(220,220)"), 0);
run("depositTrace(220, 220, 0.2); updateTraceField();");
assert.ok(run("traceAt(220,220)") > 0);

// Different mechanisms remain individually reachable.
for (const mech of ["habitat", "social", "traces", "ecology"]) {
  assert.ok(sources.join("\n").includes('"' + mech + '"'), mech + " mechanism absent");
}
console.log("Browser Bestiary simulation smoke checks passed.");
