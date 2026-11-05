# Browser Bestiary

*An incomplete record of things found living here.*

**[Play the browser prototype](https://hlywa.github.io/browser-bestiary/)**

A small, black-and-white artificial-life observation and deduction game built with [p5.js](https://p5js.org/). Strange glyph-creatures inhabit a clearing. Watch them, alter their environment, and assemble short field poems that describe the mechanisms behind their behavior. Correct accounts enter a saved bestiary.

The larger artistic and research question: **Can playful, poetic observation help us develop better intuitive models of unfamiliar forms of life?**

### Living documentation

- **[Game design](docs/DESIGN.md)** — player experience, interaction loop, five-creature design grammar, actual and planned behavior, field-poem form, UI decisions, playtest notes and development priorities.
- **[Research + annotated bibliography](docs/RESEARCH.md)** — Umwelt and artificial ethology, model specifications, research hypotheses and methods, evidence and limitations, reading archive and literature leads.

### Current state

Early playable prototype, not a finished five-species ecology. The first encounters compare environmental dwell time and neighbor attraction. **The fourth encounter now mixes Edglings and two Howlers in a preliminary predator-prey simulation**, with hunger, pursuit, brief prey disappearance and a visual howl that can be silenced. The **third encounter** now gives Afterlings a distinct fading-trace field and locally responsive trail-following behavior, with an erase-traces experiment. Hushlings and Manyones still lack independent behavior systems. The bestiary now stores optional first impressions, predictions and revised notes; recorded entries include tiny species drawings. Research claims and limitations are documented separately.

### Repository

- [sketch.js](sketch.js) — p5.js agents, movement rules, experiment controls and inference logic.
- [index.html](index.html) and [style.css](style.css) — browser interface and visual composition.
- [docs/DESIGN.md](docs/DESIGN.md) and [docs/RESEARCH.md](docs/RESEARCH.md) — living creative and scholarly documentation.

**Development principle:** model the behavior first; make it legible through observation and intervention; then find the strange and poetic language that the behavior can sustain.

Creator: Rachel Heleva.
