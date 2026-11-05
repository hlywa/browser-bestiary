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
const STORAGE_KEY = "browser-bestiary-field-poems-v1";

function setup() {
  const canvas = createCanvas(1000, 560);
  canvas.parent("sketch-container");
  loadEntries();
  setupUI();
  beginStudy();
}

function draw() {
  background(5);
  if (frameCount % 3 === 0) {
    for (const agent of agents) updateAgent(agent);
  }
  drawHabitat();
  for (const agent of agents) drawAgent(agent);
  if (frameCount % 45 === 0) { updateStatus(); updateFieldMeasurement(); }
}

function beginStudy() {
  captured = false;
  encounterIndex = (studyNumber - 1) % 4;
  interventionCount = 0;
  observationSeed = 4201 + studyNumber * 137;
  randomSeed(observationSeed);
  // Study alternates mechanisms, but does not announce which one is active.
  mechanism = studyNumber % 2 === 1 ? "habitat" : "social";
  habitat = { x: 620, y: 270, radius: 155 };
  agents = [];
  for (let i = 0; i < AGENT_COUNT; i++) {
    const a = random(TWO_PI);
    agents.push({
      x: random(80, width - 80),
      y: random(75, height - 75),
      angle: a,
      speed: random(1.1, 1.7),
      phase: random(TWO_PI)
    });
  }
  const encounterNames = ["the edglings", "the nearlets", "the little almosts", "the wanderlings"];
  document.getElementById("sighting-label").textContent =
    "field study no. " + String(studyNumber).padStart(3, "0") +
    " / " + encounterNames[encounterIndex];
  document.querySelectorAll("#poem-one, #poem-two, #poem-three")
    .forEach(select => { select.value = ""; });
  document.getElementById("observation-notes").value = "";
  document.getElementById("record-message").textContent = "";
  document.getElementById("record-entry").removeAttribute("data-result");
  clearPoemFeedback();
  document.getElementById("move-habitat").disabled = false;
  document.getElementById("divide-agents").disabled = false;
  document.getElementById("record-entry").disabled = false;
  updateStatus();
  updateFieldMeasurement();
  renderDebug();
}

function updateAgent(agent) {
  if (mechanism === "habitat") {
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
  push();
  translate(agent.x, agent.y);
  rotate(agent.angle);
  noFill();
  stroke(242);
  strokeWeight(1.0);
  if (encounterIndex === 0) {
    ellipse(0, 0, 15, 10);
    circle(4, -1, 2.5);
    line(-6, 0, -15, -6);
    line(-6, 0, -15, 6);
    line(-1, 5, -3, 13);
  } else if (encounterIndex === 1) {
    ellipse(0, 0, 12, 13);
    circle(3, -2, 2.5);
    line(-3, -6, -9, -16);
    line(-4, 6, -9, 17);
    line(5, 6, 13, 15);
  } else if (encounterIndex === 2) {
    ellipse(0, 0, 18, 7);
    circle(7, 0, 2);
    line(-9, 0, -23, -4);
    line(-9, 0, -23, 5);
    line(0, 4, 6, 16);
  } else {
    circle(0, 0, 12);
    circle(4, -2, 3);
    line(-4, -4, -15, -13);
    line(-5, 4, -16, 12);
    line(3, 6, 2, 19);
  }
  pop();
}

function moveHabitat() {
  if (captured) return;
  habitat.x = habitat.x > width / 2 ? 240 : 735;
  habitat.y = habitat.y > height / 2 ? 190 : 330;
  interventionCount++;
  updateStatus();
}

function disturbGathering() {
  if (captured) return;
  // Temporarily scatter agents into two distant subgroups.
  for (let i = 0; i < agents.length; i++) {
    agents[i].x = i < agents.length / 2 ? random(250, 330) : random(660, 740);
    agents[i].y = random(150, 420);
    agents[i].angle = random(TWO_PI);
  }
  interventionCount++;
  updateStatus();
}

function repeatObservation() {
  if (captured) {
    studyNumber++;
    beginStudy();
    return;
  }
  // Repeat the same rule set with a fresh initial configuration.
  randomSeed(observationSeed + interventionCount + 17);
  for (const a of agents) {
    a.x = random(80, width - 80);
    a.y = random(75, height - 75);
    a.angle = random(TWO_PI);
  }
  interventionCount++;
  updateStatus();
}

function updateStatus() {
  const status = document.getElementById("creature-status");
  status.textContent = captured
    ? "Your account is complete. The next inhabitants await."
    : "A gathering of small organisms. Its cause is unknown.";
  document.getElementById("experiment-status").textContent = captured
    ? "Recorded. Close the book for your next encounter, or use the next encounter button."
    : interventionCount === 0
      ? "Try moving the hollow or disturbing the gathering before making your inference."
      : "The clearing has been disturbed " + interventionCount +
        (interventionCount === 1 ? " time." : " times.") +
        " Watch how the creatures respond.";
}

function updateFieldMeasurement() {
  const element = document.getElementById("field-measurement");
  if (!element || !agents.length) return;
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
  document.getElementById("divide-agents").addEventListener("click", disturbGathering);
  document.getElementById("repeat-trial").addEventListener("click", repeatObservation);
  document.getElementById("record-entry").addEventListener("click", recordCurrentEntry);
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
  // Completing an entry advances the ecology when the book is closed.
  if (captured) advanceEncounter();
}

function advanceEncounter() {
  if (!captured) return;
  studyNumber++;
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
  const answers = names.map((name, idx) => {
    const select = document.getElementById("poem-" + name);
    const correctOption = Array.from(select.options).find(opt => opt.value === mechanism);
    const chosenOption = select.options[select.selectedIndex];
    const status = !select.value ? "not selected" :
      select.value === mechanism ? "CORRECT" : "INCORRECT";
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
    "Captured: " + captured + "\n" +
    "Habitat center: (" + round(habitat.x) + ", " + round(habitat.y) + ")";
}

function showLineFeedback(answers) {
  const names = ["one", "two", "three"];
  let correctCount = 0;
  answers.forEach((value, idx) => {
    const isCorrect = value === mechanism;
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
    const stem = ["They are found ", "When the world is changed, ", "What binds them is "][i];
    return stem + select.options[select.selectedIndex].text + ".";
  });
  const entry = {
    id: "study-" + String(studyNumber).padStart(3, "0"),
    name: document.getElementById("sighting-label").textContent.split(" / ")[1],
    date: new Date().toISOString(),
    notes: document.getElementById("observation-notes").value.trim(),
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
  message.textContent = "The field poem is complete. Close the book to meet the next creature.";
  updateStatus();
  selectTab("entries");
}

function loadEntries() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    recordedEntries = Array.isArray(data) ? data : [];
    const maxStudy = recordedEntries.reduce((m, e) => {
      const n = Number((e.id || "").split("-")[1]) || 0;
      return Math.max(m, n);
    }, 0);
    studyNumber = maxStudy + 1;
  } catch (_) {
    recordedEntries = [];
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

function renderEntries() {
  const list = document.getElementById("entries-list");
  list.replaceChildren();
  if (recordedEntries.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "The pages are empty. No account has yet been completed.";
    list.append(p);
  } else {
    for (const entry of recordedEntries) {
      const card = document.createElement("article");
      card.className = "entry-card";
      const h = document.createElement("h3");
      h.textContent = (entry.name || "unclassified") + " / " + entry.id;
      card.append(h);
      for (const line of entry.lines || []) {
        const p = document.createElement("p");
        p.className = "poem-line";
        p.textContent = line;
        card.append(p);
      }
      if (entry.notes) {
        const p = document.createElement("p");
        p.textContent = "Field notes: " + entry.notes;
        card.append(p);
      }
      list.append(card);
    }
  }
  if (captured) {
    const next = document.createElement("button");
    next.id = "next-sighting";
    next.type = "button";
    next.textContent = "next encounter →";
    next.addEventListener("click", () => {
      advanceEncounter();
      closeBestiary();
    });
    list.prepend(next);
  }
}
