/*
 * Browser Bestiary, field study 001.
 * Two distinct agent rules can form superficially similar gatherings:
 * A. habitat dwellers slow down in a favorable zone without sensing neighbors
 * B. social wanderers sense and turn toward neighbors, ignoring the zone
 * The mechanism is hidden until the player explains it through a three-line poem.
 */
let agents = [];
let habitat = { x: 620, y: 270, radius: 155 };
let mechanism = "habitat";
let studyNumber = 1;
let observationSeed = 4201;
let interventionCount = 0;
let recordedEntries = [];
let captured = false;
let encounterIndex = 0;
const AGENT_COUNT = 24;
const SIM_STEP_MS = 50; // 20 deterministic agent updates per second, independent of redraw rate.
let previousFrameMs = null;
let accumulatedMs = 0;
const STORAGE_KEY = "browser-bestiary-field-poems-v1";
const STUDY_KEY = "browser-bestiary-current-study-v1"; // Position is independent of recorded poems.
let preyTaken = 0;
let howlingEnabled = true;
let basePoemMarkup = [];
const basePoemLabels = ["I. They are found...", "II. When the world is changed...", "III. What binds them is..."];
const HOWLER_ANSWERS = ["prey", "flee", "uncoupled"];
const AFTERLING_ANSWERS = ["traces", "environment", "fade"];
const TRACE_CELL = 20;
const TRACE_COLS = 50, TRACE_ROWS = 28;
let traceField = new Float32Array(TRACE_COLS * TRACE_ROWS);
let tracesErased = 0;
let afterlingSteps = 0;

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
function updateTraceField() {
  // Traces disappear unless organisms keep depositing them.
  for (let i = 0; i < traceField.length; i++) traceField[i] *= 0.994;
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
function updateAfterling(agent) {
  // Local sensing ahead, never knowing which other organism laid a mark.
  const feeler = 30, spread = 0.56;
  const ahead = traceAt(agent.x + Math.cos(agent.angle) * feeler, agent.y + Math.sin(agent.angle) * feeler);
  const left = traceAt(agent.x + Math.cos(agent.angle - spread) * feeler, agent.y + Math.sin(agent.angle - spread) * feeler);
  const right = traceAt(agent.x + Math.cos(agent.angle + spread) * feeler, agent.y + Math.sin(agent.angle + spread) * feeler);
  if (Math.max(ahead, left, right) > 0.09) {
    if (left > ahead + 0.025 && left > right) agent.angle -= 0.13;
    else if (right > ahead + 0.025 && right > left) agent.angle += 0.13;
    agent.angle += random(-0.065, 0.065);
  } else {
    agent.angle += random(-0.30, 0.30);
  }
  agent.x += Math.cos(agent.angle) * 2.65;
  agent.y += Math.sin(agent.angle) * 2.65;
  depositTrace(agent.x, agent.y, 0.025);
}

function setup() {
  const canvas = createCanvas(1000, 560);
  canvas.parent("sketch-container");
  loadEntries();
  basePoemMarkup = ["one","two","three"].map(name => document.getElementById("poem-" + name).innerHTML);
  setupUI();
  beginStudy();
  renderEntries(); // Restore previous local bestiary entries on load.
}

function draw() {
  background(5);
  const now = millis();
  const elapsed = previousFrameMs === null ? SIM_STEP_MS : Math.max(0, Math.min(200, now - previousFrameMs));
  previousFrameMs = now;
  accumulatedMs += elapsed;
  // Clamp tab-inactive catch-up; long absences should not cause simulation bursts.
  let steps = 0;
  while (accumulatedMs >= SIM_STEP_MS && steps < 4) {
    if (mechanism === "traces") updateTraceField();
    for (const agent of agents) updateAgent(agent);
    if (mechanism === "traces") afterlingSteps++;
    accumulatedMs -= SIM_STEP_MS;
    steps++;
  }
  if (mechanism === "traces") drawTraces();
  else drawHabitat();
  for (const agent of agents) drawAgent(agent);
  if (frameCount % 45 === 0) { updateStatus(); updateFieldMeasurement(); }
}

function beginStudy() {
  captured = false;
  accumulatedMs = 0;
  previousFrameMs = null;
  encounterIndex = (studyNumber - 1) % 5;
  interventionCount = 0;
  observationSeed = 4201 + studyNumber * 137;
  randomSeed(observationSeed);
  // Study alternates mechanisms, but does not announce which one is active.
  mechanism = encounterIndex === 2 ? "traces" : encounterIndex === 3 ? "ecology" : studyNumber % 2 === 1 ? "habitat" : "social";
  afterlingSteps = 0;
  tracesErased = 0;
  if (mechanism === "traces") seedOldTraces();
  else traceField.fill(0);
  preyTaken = 0;
  howlingEnabled = true;
  habitat = { x: 620, y: 270, radius: 155 };
  agents = [];
  for (let i = 0; i < AGENT_COUNT; i++) {
    const a = random(TWO_PI);
    agents.push({
      x: random(80, width - 80),
      y: random(75, height - 75),
      angle: a,
      speed: random(1.1, 1.7),
      phase: random(TWO_PI),
      speciesId: encounterIndex === 3 ? (i >= AGENT_COUNT - 2 ? 3 : 0) : encounterIndex,
      alive: true, respawn: 0, hunger: 0, ticks: 0, howlClock: 0
    });
  }
  if (mechanism === "traces") {
    // Place first sightings near old tracks, but allow fresh paths to emerge.
    for (const a of agents) {
      const t = random(0.08, 0.92);
      const x = 65 + t * 170 * 5.1;
      const y = random() < 0.5
        ? 210 + 78 * Math.sin(t * Math.PI * 2.1) + 25 * Math.sin(t * 12)
        : 378 - 64 * Math.sin(t * Math.PI * 1.8) - 18 * Math.sin(t * 14);
      a.x = x + random(-24, 24);
      a.y = y + random(-25, 25);
      a.angle = random(TWO_PI);
    }
  }
  const encounterNames = ["the edglings", "the hushlings", "the afterlings", "the howlers", "the manyones"];
  document.getElementById("sighting-label").textContent =
    "field study no. " + String(studyNumber).padStart(3, "0") +
    " / " + encounterNames[encounterIndex];
  configurePoem();
  document.getElementById("observation-notes").value = "";
  document.getElementById("field-prediction").value = "";
  document.getElementById("revised-notes").value = "";
  document.getElementById("next-encounter").hidden = true;
  document.getElementById("move-habitat").hidden = encounterIndex === 2;
  document.getElementById("erase-traces").hidden = encounterIndex !== 2;
  document.getElementById("divide-agents").textContent = encounterIndex === 2 ? "scatter the afterlings" : "disturb the gathering";
  document.getElementById("silence-howl").hidden = encounterIndex !== 3;
  document.getElementById("silence-howl").textContent = "silence the howl";
  document.getElementById("record-message").textContent = "";
  document.getElementById("record-entry").removeAttribute("data-result");
  clearPoemFeedback();
  document.getElementById("move-habitat").disabled = false;
  document.getElementById("divide-agents").disabled = false;
  document.getElementById("record-entry").disabled = false;
  document.getElementById("repeat-trial").disabled = false;
  document.getElementById("silence-howl").disabled = false;
  document.getElementById("erase-traces").disabled = false;
  updateStatus();
  updateFieldMeasurement();
  renderDebug();
}

function configurePoem() {
  const names = ["one", "two", "three"];
  const afterlingLabels = ["I. They travel...", "II. What holds their paths...", "III. When the traces vanish..."];
  const afterlingChoices = [
    [["traces", "along the faint marks left in the clearing"], ["social", "toward the bodies of those they can see"], ["random", "without anything to follow"]],
    [["environment", "is a memory held by the ground"], ["leader", "is a leader who remembers the way"], ["map", "is a map carried inside each creature"]],
    [["fade", "old routes fade and new wandering paths are made"], ["freeze", "every creature becomes completely still"], ["reappear", "the old paths return without being walked"]]
  ];
  const howlerLabels = [
    "I. The howler seeks...",
    "II. When it approaches...",
    "III. Its cry..."
  ];
  const howlerChoices = [
    [["prey", "the little bodies moving nearby"], ["hollow", "the pale hollow, whether or not prey is there"], ["pack", "the company of its own kind"]],
    [["flee", "the edglings retreat from its approach"], ["freeze", "the edglings are stilled by its cry"], ["greet", "the edglings turn eagerly toward it"]],
    [["uncoupled", "sounds while it hungers, but is not what drives prey to flee"], ["control", "commands every edgling to stop"], ["lure", "draws the edglings closer"]]
  ];
  names.forEach((name, i) => {
    const select = document.getElementById("poem-" + name);
    const label = document.querySelector('label[for="poem-' + name + '"]');
    label.textContent = encounterIndex === 2 ? afterlingLabels[i] : encounterIndex === 3 ? howlerLabels[i] : basePoemLabels[i];
    if (encounterIndex !== 2 && encounterIndex !== 3) {
      select.innerHTML = basePoemMarkup[i];
    } else {
      select.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "complete this line...";
      select.append(placeholder);
      (encounterIndex === 2 ? afterlingChoices[i] : howlerChoices[i]).forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.append(option);
      });
    }
    select.value = "";
  });
  document.getElementById("poem-instruction").textContent = encounterIndex === 2
    ? "Their paths remain after they pass. Erase the traces, then watch what happens to the routes."
    : encounterIndex === 3
      ? "Watch the larger hunters among the edglings. The cry and the pursuit might not have the same cause."
      : "Watch before you name a cause. Try changing the clearing, then record what you think you observed.";
}

function correctAnswers() {
  return encounterIndex === 2 ? AFTERLING_ANSWERS : encounterIndex === 3 ? HOWLER_ANSWERS : [mechanism, mechanism, mechanism];
}

function updateAgent(agent) {
  if (!agent.alive) {
    if (--agent.respawn <= 0 && agent.speciesId === 0) {
      agent.alive = true;
      agent.x = random(30, width - 30);
      agent.y = random(30, height - 30);
      agent.angle = random(TWO_PI);
    }
    return;
  }
  if (mechanism === "ecology") {
    updateEcologyAgent(agent);
  } else if (mechanism === "traces") {
    updateAfterling(agent);
  } else if (mechanism === "habitat") {
    const inZone = dist(agent.x, agent.y, habitat.x, habitat.y) < habitat.radius;
    // Random movement, not purposeful steering. Dwellers simply linger.
    agent.angle += random(-0.5, 0.5);
    const step = inZone ? 0.23 : 2.2;
    agent.x += cos(agent.angle) * step;
    agent.y += sin(agent.angle) * step;
  } else {
    // Sense neighbors only: no access to the pale hollow.
    let cx = 0, cy = 0, count = 0;
    for (const other of agents) {
      if (other === agent) continue;
      const d = dist(agent.x, agent.y, other.x, other.y);
      if (d < 520) {
        cx += other.x;
        cy += other.y;
        count++;
      }
    }
    if (count > 0) {
      let target = atan2(cy / count - agent.y, cx / count - agent.x);
      const turn = atan2(sin(target - agent.angle), cos(target - agent.angle));
      agent.angle += constrain(turn, -0.10, 0.10) + random(-0.09, 0.09);
    } else {
      agent.angle += random(-0.2, 0.2);
    }
    agent.x += cos(agent.angle) * agent.speed;
    agent.y += sin(agent.angle) * agent.speed;
  }
  // Reflect from the clearing boundaries.
  if (agent.x < 12 || agent.x > width - 12) {
    agent.angle = PI - agent.angle;
    agent.x = constrain(agent.x, 12, width - 12);
  }
  if (agent.y < 12 || agent.y > height - 12) {
    agent.angle *= -1;
    agent.y = constrain(agent.y, 12, height - 12);
  }
}

// Small mixed-species experiment: Edglings favor the hollow and flee *nearby bodies*;
// Howlers see prey, get hungry, pursue and consume; their visible howls do not
// directly affect Edgling decisions. This is not evolved or general predator ecology.
function updateEcologyAgent(agent) {
  agent.ticks++;
  if (agent.speciesId === 3) {
    agent.hunger += 0.28;
    if (howlingEnabled && agent.hunger > 14 && agent.ticks % 150 === 0) {
      agent.howlClock = 24;
    }
    if (agent.howlClock > 0) agent.howlClock--;
    let prey = null, nearest = 280;
    for (const other of agents) {
      if (!other.alive || other.speciesId !== 0) continue;
      const d = dist(agent.x, agent.y, other.x, other.y);
      if (d < nearest) { nearest = d; prey = other; }
    }
    if (prey && agent.hunger >= 14) {
      const target = atan2(prey.y - agent.y, prey.x - agent.x);
      const diff = atan2(sin(target - agent.angle), cos(target - agent.angle));
      agent.angle += constrain(diff, -0.22, 0.22);
      agent.x += cos(agent.angle) * 3.0;
      agent.y += sin(agent.angle) * 3.0;
      if (nearest < 15) {
        prey.alive = false;
        prey.respawn = 240;
        agent.hunger = 0;
        preyTaken++;
        agent.howlClock = 0;
      }
    } else {
      agent.angle += random(-0.25, 0.25);
      agent.x += cos(agent.angle) * 1.1;
      agent.y += sin(agent.angle) * 1.1;
    }
  } else {
    // An Edgling has local habitat sensing plus a short predator proximity cue.
    // No subjective fear is implied: steering away is the whole modeled response.
    let threat = null, nearest = 100;
    for (const other of agents) {
      if (other.speciesId !== 3 || !other.alive) continue;
      const d = dist(agent.x, agent.y, other.x, other.y);
      if (d < nearest) { threat = other; nearest = d; }
    }
    if (threat) {
      const target = atan2(agent.y - threat.y, agent.x - threat.x);
      const diff = atan2(sin(target - agent.angle), cos(target - agent.angle));
      agent.angle += constrain(diff, -0.3, 0.3) + random(-0.08, 0.08);
      agent.x += cos(agent.angle) * 2.8;
      agent.y += sin(agent.angle) * 2.8;
    } else {
      const inZone = dist(agent.x, agent.y, habitat.x, habitat.y) < habitat.radius;
      agent.angle += random(-0.5, 0.5);
      const step = inZone ? 0.23 : 2.2;
      agent.x += cos(agent.angle) * step;
      agent.y += sin(agent.angle) * step;
    }
  }
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

function drawAgent(agent) {
  if (!agent.alive) return;
  push();
  translate(agent.x, agent.y);
  rotate(agent.angle);
  noFill();
  stroke(242);
  strokeWeight(1.0);
  if (agent.speciesId === 0) {
    ellipse(0, 0, 15, 10);
    circle(4, -1, 2.5);
    line(-6, 0, -15, -6);
    line(-6, 0, -15, 6);
    line(-1, 5, -3, 13);
  } else if (agent.speciesId === 1) {
    // Hushling: a tiny birdlike listening creature, unlike the oval Edgling.
    // Distinctive angled body, lifted head, pointed beak, wing and two legs.
    triangle(-11, 4, -2, -7, 5, 5);
    circle(5, -6, 8);
    triangle(9, -7, 16, -5, 9, -3);
    point(6, -7);
    line(-7, 1, 1, 2);   // folded wing
    line(-10, 3, -17, -2); // tail flick
    line(-1, 5, -3, 13);
    line(5, 5, 7, 13);
  } else if (agent.speciesId === 2) {
    // Afterling: narrow crescent/needle body, open forked antenna, two tiny feet.
    // No oval body or Edgling tail. The form should read as an incomplete letter.
    arc(0, 0, 22, 19, -1.35, 1.35);
    line(4, -8, 13, -13);
    line(4, -8, 14, -4);
    point(7, -2);
    line(-4, 7, -8, 13);
    line(1, 8, -1, 14);
  } else if (agent.speciesId === 3) {
    // Howler field-sketch glyph: intentionally as spare as the Edgling.
    // A pointed ear, small body, open toothed snout and a few howl marks.
    // Minimal visual reference. During encounter 4, this agent also pursues prey.
    ellipse(-1, 1, 15, 10);
    triangle(-7, -3, -7, -10, -1, -5); // ear
    line(5, -2, 12, -7);               // raised snout
    line(12, -7, 12, -1);              // open mouth
    line(12, -1, 7, 0);
    line(10, -4, 9, -2);               // one small tooth
    circle(4, -3, 1.8);                // eye
    line(-6, 5, -9, 11);               // feet
    line(1, 6, 0, 12);
    line(-8, 1, -15, -3);              // tail
    if (agent.howlClock > 0 && howlingEnabled && mechanism === "ecology") {
      line(15, -9, 18, -11);           // audible call, not a permanent body feature
      line(16, -5, 20, -5);
    }
  } else {
    circle(0, 0, 12);
    circle(4, -2, 3);
    line(-4, -4, -15, -13);
    line(-5, 4, -16, 12);
    line(3, 6, 2, 19);
  }
  pop();
  if (mechanism === "ecology" && agent.speciesId === 3 && agent.howlClock > 0 && howlingEnabled) {
    push();
    noFill();
    stroke(220, 220, 220, 110 * agent.howlClock / 24);
    strokeWeight(0.9);
    circle(agent.x, agent.y, 25 + (24 - agent.howlClock) * 2.3);
    pop();
  }
}

function moveHabitat() {
  if (captured) return;
  habitat.x = habitat.x > width / 2 ? 240 : 735;
  habitat.y = habitat.y > height / 2 ? 190 : 330;
  interventionCount++;
  updateStatus();
  renderDebug();
}

function eraseTraces() {
  if (captured || mechanism !== "traces") return;
  traceField.fill(0);
  tracesErased++;
  interventionCount++;
  updateStatus();
  renderDebug();
}

function disturbGathering() {
  if (captured) return;
  // Temporarily scatter agents into two distant subgroups.
  for (let i = 0; i < agents.length; i++) {
    agents[i].x = i < agents.length / 2 ? random(250, 330) : random(660, 740);
    agents[i].y = random(150, 420);
    agents[i].angle = random(TWO_PI);
    agents[i].alive = true;
    agents[i].respawn = 0;
  }
  interventionCount++;
  updateStatus();
  renderDebug();
}

function repeatObservation() {
  if (captured) return; // Progression has its own explicit field control.
  // Repeat the same rule set with a fresh initial configuration.
  randomSeed(observationSeed + interventionCount + 17);
  for (const a of agents) {
    a.x = random(80, width - 80);
    a.y = random(75, height - 75);
    a.angle = random(TWO_PI);
    a.alive = true;
    a.respawn = 0;
    a.hunger = 0;
  }
  preyTaken = 0;
  if (mechanism === "traces") seedOldTraces();
  interventionCount++;
  updateStatus();
  renderDebug();
}

function updateStatus() {
  const status = document.getElementById("creature-status");
  status.textContent = captured
    ? "Your account is complete. The next inhabitants await."
    : mechanism === "traces"
      ? "Their routes outlast their bodies. No creature carries the whole path."
      : mechanism === "ecology"
        ? "A few toothed creatures have entered the clearing among the edglings. Watch what changes."
        : "A gathering of small organisms. Its cause is unknown.";
  document.getElementById("experiment-status").textContent = captured
    ? "Entry recorded. Choose next encounter from the field controls when ready."
    : interventionCount === 0
      ? "Observe first; change a condition if you want to test your interpretation."
      : "The clearing has been disturbed " + interventionCount +
        (interventionCount === 1 ? " time." : " times.") +
        " Watch how the creatures respond.";
}

function updateFieldMeasurement() {
  const element = document.getElementById("field-measurement");
  if (!element || !agents.length) return;
  if (mechanism === "traces") {
    const marked = traceField.filter(v => v > 0.10).length;
    element.textContent = "field reading · " + marked + " marked places · " + tracesErased + " erasures";
    return;
  }
  if (mechanism === "ecology") {
    const prey = agents.filter(a => a.speciesId === 0 && a.alive).length;
    element.textContent = "field reading · " + prey + " edglings visible · " + preyTaken + " taken by howlers";
    return;
  }
  let inside = 0;
  let distances = 0;
  for (const a of agents) {
    if (dist(a.x, a.y, habitat.x, habitat.y) < habitat.radius) inside++;
    let nearest = Infinity;
    for (const b of agents) {
      if (a === b) continue;
      nearest = min(nearest, dist(a.x, a.y, b.x, b.y));
    }
    distances += nearest;
  }
  element.textContent = "field reading · " + inside + " of " + agents.length +
    " inside the pale hollow · mean distance to nearest neighbor: " +
    round(distances / agents.length) + " px";
}

function setupUI() {
  document.getElementById("start-game").addEventListener("click", () => {
    document.body.classList.add("started");
    // Begin the field study at the moment the player enters.
    beginStudy();
    document.getElementById("bestiary-toggle").focus();
  });
  document.getElementById("bestiary-toggle").addEventListener("click", toggleBestiary);
  document.getElementById("close-panel").addEventListener("click", closeBestiary);
  document.querySelectorAll(".tab").forEach(tab =>
    tab.addEventListener("click", () => selectTab(tab.dataset.tab)));
  document.getElementById("move-habitat").addEventListener("click", moveHabitat);
  document.getElementById("erase-traces").addEventListener("click", eraseTraces);
  document.getElementById("divide-agents").addEventListener("click", disturbGathering);
  document.getElementById("silence-howl").addEventListener("click", () => {
    if (captured || mechanism !== "ecology") return;
    howlingEnabled = !howlingEnabled;
    for (const a of agents) a.howlClock = 0;
    document.getElementById("silence-howl").textContent = howlingEnabled ? "silence the howl" : "restore the howl";
    interventionCount++;
    updateStatus();
    renderDebug();
  });
  document.getElementById("repeat-trial").addEventListener("click", repeatObservation);
  document.getElementById("record-entry").addEventListener("click", recordCurrentEntry);
  document.getElementById("restart-studies").addEventListener("click", restartFieldStudies);
  document.getElementById("replay-from-start").addEventListener("click", replayFromStart);
  document.getElementById("next-encounter").addEventListener("click", () => {
    if (!captured) return;
    advanceEncounter();
    closeBestiary();
  });
  document.querySelectorAll("#poem-one, #poem-two, #poem-three").forEach(sel => {
    sel.addEventListener("change", () => {
      sel.removeAttribute("data-check");
      const feedback = document.getElementById("feedback-" + sel.id.split("-")[1]);
      if (feedback) feedback.textContent = "";
      document.getElementById("record-entry").removeAttribute("data-result");
      renderDebug();
    });
  });
  // Canvas acts as a click-outside target; the player can immediately observe again.
  document.querySelector("main").addEventListener("pointerdown", event => {
    // Click on empty world or heading closes book; field tools remain clickable.
    if (event.target.closest("#field-tools")) return;
    if (document.getElementById("bestiary-panel").classList.contains("open")) closeBestiary();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeBestiary();
    if (event.shiftKey && event.key.toLowerCase() === "d" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      toggleDebug();
    }
  });
}

function toggleBestiary() {
  const panel = document.getElementById("bestiary-panel");
  if (panel.classList.contains("open")) { closeBestiary(); return; }
  const isOpen = panel.classList.toggle("open");
  panel.setAttribute("aria-hidden", String(!isOpen));
  document.getElementById("bestiary-toggle")
    .setAttribute("aria-expanded", String(isOpen));
}

function closeBestiary() {
  const panel = document.getElementById("bestiary-panel");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.getElementById("bestiary-toggle")
    .setAttribute("aria-expanded", "false");
  // Closing the book never advances the study. Only the field button does.
}

function advanceEncounter() {
  if (!captured) return;
  studyNumber++;
  saveStudyPosition();
  beginStudy();
  renderEntries();
  selectTab("guessing");
}

function selectTab(target) {
  document.querySelectorAll(".tab").forEach(tab => {
    const active = tab.dataset.tab === target;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".tab-content").forEach(panel => {
    panel.classList.toggle("active", panel.id === target + "-tab");
  });
}

function clearPoemFeedback() {
  ["one", "two", "three"].forEach(name => {
    const select = document.getElementById("poem-" + name);
    const label = document.getElementById("feedback-" + name);
    if (select) select.removeAttribute("data-check");
    if (label) label.textContent = "";
  });
}

function toggleDebug() {
  const panel = document.getElementById("debug-panel");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) renderDebug();
}

// Developer-only display: show the exact answer text, not just internal values.
function renderDebug() {
  const panel = document.getElementById("debug-panel");
  if (panel.hidden) return;
  const names = ["one", "two", "three"];
  const correct = correctAnswers();
  const answers = names.map((name, idx) => {
    const select = document.getElementById("poem-" + name);
    const correctOption = Array.from(select.options).find(opt => opt.value === correct[idx]);
    const chosenOption = select.options[select.selectedIndex];
    const status = !select.value ? "not selected" :
      select.value === correct[idx] ? "CORRECT" : "INCORRECT";
    return (idx + 1) + ". " + (correctOption ? correctOption.text : "[missing answer]") +
      "\n   Your selection: " + (chosenOption && select.value ? chosenOption.text : "none") +
      " [" + status + "]";
  });
  panel.textContent = "DEVELOPER FIELD GUIDE (Shift+D)\n" +
    "Study " + studyNumber + "\n" +
    "Mechanism: " + mechanism + "\n\n" +
    "EXACT ANSWER KEY:\n" + answers.join("\n\n") + "\n\n" +
    "Interventions: " + interventionCount + "\n" +
    "Agents: " + agents.length + "\n" +
    (mechanism === "ecology" ? "Edglings taken: " + preyTaken + "\nHowling enabled: " + howlingEnabled + "\n" : "") +
    (mechanism === "traces" ? "Marked cells: " + traceField.filter(v => v > 0.10).length + "\nErasures: " + tracesErased + "\n" : "") +
    "Captured: " + captured + "\n" +
    "Habitat center: (" + round(habitat.x) + ", " + round(habitat.y) + ")";
}

function showLineFeedback(answers) {
  const names = ["one", "two", "three"];
  let correctCount = 0;
  const correct = correctAnswers();
  answers.forEach((value, idx) => {
    const isCorrect = value === correct[idx];
    if (isCorrect) correctCount++;
    document.getElementById("poem-" + names[idx]).dataset.check =
      isCorrect ? "correct" : "wrong";
    document.getElementById("feedback-" + names[idx]).textContent =
      isCorrect ? "This observation is supported." : "This line needs another look.";
  });
  document.getElementById("record-entry").dataset.result =
    correctCount === 3 ? "correct" : "wrong";
  return correctCount;
}

function recordCurrentEntry() {
  const fields = ["poem-one", "poem-two", "poem-three"];
  const answers = fields.map(id => document.getElementById(id).value);
  const message = document.getElementById("record-message");
  if (captured) {
    message.textContent = "This study is already recorded. Begin another encounter.";
    return;
  }
  if (answers.some(x => !x)) {
    message.textContent = "All three lines must be completed.";
    return;
  }
  const correctLines = showLineFeedback(answers);
  if (correctLines < 3) {
    message.textContent = correctLines + " of 3 lines are supported. Revisit the clearing and try again.";
    return;
  }
  const lines = fields.map((id, i) => {
    const select = document.getElementById(id);
    const stem = (encounterIndex === 2
      ? ["They travel ", "What holds their paths ", "When the traces vanish, "]
      : encounterIndex === 3
        ? ["The howler seeks ", "When it approaches, ", "Its cry "]
        : ["They are found ", "When the world is changed, ", "What binds them is "])[i];
    return stem + select.options[select.selectedIndex].text + ".";
  });
  const entry = {
    id: "study-" + String(studyNumber).padStart(3, "0"),
    name: document.getElementById("sighting-label").textContent.split(" / ")[1],
    date: new Date().toISOString(),
    notes: document.getElementById("observation-notes").value.trim(),
    noteVersion: 2,
    prediction: document.getElementById("field-prediction").value.trim(),
    revisedNotes: document.getElementById("revised-notes").value.trim(),
    speciesId: encounterIndex,
    mechanism: mechanism,
    lines: lines,
    interventions: interventionCount
  };
  recordedEntries.unshift(entry);
  saveEntries();
  captured = true;
  renderEntries();
  document.getElementById("move-habitat").disabled = true;
  document.getElementById("divide-agents").disabled = true;
  document.getElementById("record-entry").disabled = true;
  document.getElementById("repeat-trial").disabled = true;
  document.getElementById("silence-howl").disabled = true;
  document.getElementById("erase-traces").disabled = true;
  document.getElementById("next-encounter").hidden = false;
  message.textContent = "The field poem is complete. The next encounter is available above the clearing.";
  updateStatus();
  renderDebug();
  selectTab("entries");
}

// The field-study cursor and the collection are separate: replaying a study
// never deletes the observer's saved field poems.
function saveStudyPosition() {
  try {
    localStorage.setItem(STUDY_KEY, String(studyNumber));
  } catch (_) {
    // Navigation still works for this session when storage is unavailable.
  }
}

function replayFromStart() {
  studyNumber = 1;
  saveStudyPosition();
  beginStudy();
  renderEntries();
  selectTab("guessing");
  closeBestiary();
}

// Explicitly destructive operation: wipe only this game's entries and cursor.
function restartFieldStudies() {
  const count = recordedEntries.length;
  const message = count
    ? "Erase " + count + " saved bestiary " +
      (count === 1 ? "entry" : "entries") +
      " and restart study 001? This cannot be undone."
    : "Clear this game's saved progress and restart study 001?";
  if (!window.confirm(message)) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STUDY_KEY);
  } catch (_) {
    // In-memory reset still works if storage is unavailable.
  }
  recordedEntries = [];
  studyNumber = 1;
  saveStudyPosition();
  beginStudy();
  renderEntries();
  selectTab("guessing");
  closeBestiary();
}

function loadEntries() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    recordedEntries = Array.isArray(data) ? data : [];
    const maxStudy = recordedEntries.reduce((m, e) => {
      const n = Number((e.id || "").split("-")[1]) || 0;
      return Math.max(m, n);
    }, 0);
    // Backwards-compatible with old saves, but from now on a deliberately
    // selected replay position wins over the last completed entry.
    const storedStudy = Number(localStorage.getItem(STUDY_KEY));
    studyNumber = Number.isSafeInteger(storedStudy) && storedStudy >= 1
      ? storedStudy
      : maxStudy + 1;
  } catch (_) {
    recordedEntries = [];
    studyNumber = 1;
  }
}

function saveEntries() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordedEntries));
  } catch (_) {
    document.getElementById("record-message").textContent =
      "Entry recorded for this visit. This browser did not allow permanent saving.";
  }
}

// Tiny inline SVGs repeat the actual in-field glyph vocabulary in the collection.
// Use a saved species index when available; infer it from legacy entry names otherwise.
function createEntryPortrait(entry) {
  const labels = ["edglings", "hushlings", "afterlings", "howlers", "manyones"];
  const inferred = labels.findIndex(label => (entry.name || "").toLowerCase().includes(label));
  const id = Number.isInteger(entry.speciesId) ? entry.speciesId : Math.max(0, inferred);
  const portraits = [
    '<ellipse cx="0" cy="0" rx="9" ry="6"/><circle cx="5" cy="-1" r="1.6"/><path d="M-7 0 L-17 -7 M-7 0 L-17 7 M-2 5 L-4 13"/>',
    '<path d="M-11 4 L-2 -7 L5 5 Z M-7 1 L1 2 M-10 3 L-17 -2 M-1 5 L-3 13 M5 5 L7 13"/><circle cx="5" cy="-6" r="4"/><path d="M9 -7 L16 -5 L9 -3 Z"/><circle cx="6" cy="-7" r=".85" fill="#efefea" stroke="none"/>',
    '<path d="M3 -10 Q-11 -12 -11 0 Q-10 12 3 10 M4 -9 L14 -15 M4 -9 L15 -4 M-3 8 L-7 15 M2 9 L2 16"/><circle cx="7" cy="-2" r=".8"/>',
    '<ellipse cx="-2" cy="1" rx="10" ry="7"/><path d="M-9 -4 L-9 -14 L-2 -7 M6 -2 L16 -10 L16 -1 L9 1 L16 3 M13 -6 L12 -2 M-8 7 L-11 15 M0 8 L0 16 M-11 0 L-20 -6 M19 -11 L23 -15 M20 -6 L25 -6"/><circle cx="5" cy="-4" r="1.6"/>',
    '<circle cx="0" cy="0" r="8"/><circle cx="4" cy="-2" r="2"/><path d="M-5 -5 L-17 -13 M-6 4 L-17 12 M4 7 L3 18"/>'
  ];
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "-31 -24 62 48");
  svg.setAttribute("class", "entry-portrait");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", labels[id] ? labels[id] + " illustration" : "creature illustration");
  svg.innerHTML = '<g fill="none" stroke="#efefea" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">' +
    portraits[id % portraits.length] + '</g>';
  return svg;
}

function renderEntries() {
  const list = document.getElementById("entries-list");
  list.replaceChildren();
  if (recordedEntries.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "The pages are empty. No account has yet been completed.";
    list.append(p);
    return;
  }
  for (const entry of recordedEntries) {
    const card = document.createElement("article");
    card.className = "entry-card";
    card.append(createEntryPortrait(entry));
    const copy = document.createElement("div");
    copy.className = "entry-copy";
    const heading = document.createElement("h3");
    heading.textContent = (entry.name || "unclassified") + " / " + entry.id;
    copy.append(heading);
    for (const line of entry.lines || []) {
      const p = document.createElement("p");
      p.className = "poem-line";
      p.textContent = line;
      copy.append(p);
    }
    for (const [label, value] of [
      [entry.noteVersion === 2 ? "First impression" : "Field notes", entry.notes],
      ["Prediction", entry.prediction],
      ["After observing", entry.revisedNotes]
    ]) {
      if (!value) continue;
      const p = document.createElement("p");
      p.textContent = label + ": " + value;
      copy.append(p);
    }
    card.append(copy);
    list.append(card);
  }
}
