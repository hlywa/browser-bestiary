/* Browser Bestiary. Bootstrapping and encounter coordination.
 * Behavioral models live in js/creatures.js; environmental fields in js/environment.js.
 * Small global state is retained during the first refactor to preserve browser behavior.
 */
/* Current encounters include habitat dwell time, social attraction, trace-mediated
 * movement, and one mixed predator-prey study. This is not an evolving ecosystem.
 * Encounter presentation and state are coordinated here; models live in js/.
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
  // The toolbar description must describe the current model, not a stale circle.
  document.querySelector(".field-legend").textContent =
    mechanism === "traces"
      ? "A crooked history lingers in the ground. Erase the marks to test what remains."
      : mechanism === "ecology"
        ? "The pale hollow offers shelter to edglings, but also a place where hunters may find them."
        : "The pale hollow is a place in the clearing. Move it to test what the inhabitants notice.";
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
