/* Browser Bestiary: experiments subsystem. Uses shared browser simulation state. */
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
