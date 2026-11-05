/* Browser Bestiary: environment subsystem. Uses shared browser simulation state. */
function traceIndex(x, y) {
  const col = Math.max(0, Math.min(TRACE_COLS - 1, Math.floor(x / TRACE_CELL)));
  const row = Math.max(0, Math.min(TRACE_ROWS - 1, Math.floor(y / TRACE_CELL)));
  return row * TRACE_COLS + col;
}

function traceAt(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return 0;
  return traceField[traceIndex(x, y)];
}

function depositTrace(x, y, amount) {
  const index = traceIndex(x, y);
  traceField[index] = Math.min(1.5, traceField[index] + amount);
}

function seedOldTraces() {
  traceField.fill(0);
  // Two old, crooked routes. No circular habitat or location-bound benefit.
  for (let i = 0; i <= 170; i++) {
    const x = 65 + i * 5.1;
    const t = i / 170;
    const top = 210 + 78 * Math.sin(t * Math.PI * 2.1) + 25 * Math.sin(t * 12);
    const bottom = 378 - 64 * Math.sin(t * Math.PI * 1.8) - 18 * Math.sin(t * 14);
    depositTrace(x, top, 0.68);
    depositTrace(x, bottom, 0.68);
  }
}

// Five-point local stencil: cell values spread to four neighbors and decay.
// This is a continuous-state CA-like grid, not a finite-state binary CA.
const TRACE_DIFFUSION = 0.08;
const TRACE_RETENTION = 0.994;
let traceNext = null; // Allocate after sketch.js has initialized shared dimensions.
function updateTraceField() {
  if (!traceNext || traceNext.length !== traceField.length) {
    traceNext = new Float32Array(traceField.length);
  }
  for (let y = 0; y < TRACE_ROWS; y++) {
    for (let x = 0; x < TRACE_COLS; x++) {
      const i = y * TRACE_COLS + x;
      const center = traceField[i];
      // No-flux edges: missing neighbors equal the edge cell itself.
      const left = x > 0 ? traceField[i - 1] : center;
      const right = x + 1 < TRACE_COLS ? traceField[i + 1] : center;
      const above = y > 0 ? traceField[i - TRACE_COLS] : center;
      const below = y + 1 < TRACE_ROWS ? traceField[i + TRACE_COLS] : center;
      const spread = center + TRACE_DIFFUSION *
        (left + right + above + below - 4 * center);
      traceNext[i] = Math.max(0, spread * TRACE_RETENTION);
    }
  }
  // Swap buffers: do not allow updated cells to affect neighbors in the same step.
  const previous = traceField;
  traceField = traceNext;
  traceNext = previous;
}

function drawTraces() {
  push();
  noStroke();
  for (let y = 1; y < TRACE_ROWS - 1; y++) {
    for (let x = 1; x < TRACE_COLS - 1; x++) {
      const strength = traceField[y * TRACE_COLS + x];
      if (strength < 0.035) continue;
      fill(207, 205, 194, Math.min(125, 12 + strength * 95));
      circle(x * TRACE_CELL + 10, y * TRACE_CELL + 10, 1.4 + strength * 2.8);
    }
  }
  fill(150);
  textAlign(CENTER);
  textSize(12);
  textFont("Georgia");
  text("what passes here leaves something behind", width / 2, height - 22);
  pop();
}

function drawHabitat() {
  push();
  noFill();
  stroke(220, 220, 220, 42);
  strokeWeight(1);
  ellipse(habitat.x, habitat.y, habitat.radius * 2);
  for (let i = 0; i < 16; i++) {
    const a = TWO_PI * i / 16;
    const xx = habitat.x + cos(a) * habitat.radius;
    const yy = habitat.y + sin(a) * habitat.radius;
    point(xx, yy);
  }
  fill(180);
  noStroke();
  textFont("Georgia");
  textSize(12);
  textAlign(CENTER);
  text("the pale hollow · a place in the clearing", habitat.x, habitat.y + habitat.radius + 20);
  pop();
}
