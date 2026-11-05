/* Browser Bestiary: bestiary subsystem. Uses shared browser simulation state. */
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
