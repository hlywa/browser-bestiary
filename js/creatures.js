/* Browser Bestiary: creatures subsystem. Uses shared browser simulation state. */
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
