# Browser Bestiary — Research and Annotated Bibliography

*Living research document · updated 4 November 2026*  
[Play prototype](https://hlywa.github.io/browser-bestiary/) · [Game design](DESIGN.md) · [Source code](../sketch.js)

## 1. Research context and ambition

**Project within a broader program:** *Speculative Artificial Ethology* investigates whether playful encounters with artificial life can make people notice, revise, and test the conceptual models they use to understand unfamiliar life. The longer-term program asks whether changing those modeling assumptions leads to measurably different artificial-life behavior. *Browser Bestiary* is a bounded browser-native experiment, **not** the entire program.

**Question for this prototype:** *How can a playable field guide help people construct and revise intuitive causal models of unfamiliar artificial organisms through observation, intervention, and poetic description?*

**Narrower testable version:** Given two agent systems that generate partially similar group patterns, can a player make accurate predictions about their behavior under interventions, and explain which local rule produced the pattern? Does framing observations as a structured field poem change what the player attends to?

**Why the question is not answered by the current game:** The first implementation checks three menu values against an internal label. A correct poem does **not** by itself establish conceptual understanding, transfer, unusual subjective experience, or a novel ALife phenomenon. Some of the current answer options directly disclose model distinctions. The comparison agents also produce differently dense clusters, which may make the underlying rule trivial to recognize without causal testing.

### Working terms (not interchangeable)

- **Artificial life (ALife):** computational/synthetic investigation of life-like dynamics. A moving sprite or reactive animation is not inherently evidence of emergent life.
- **Artificial / synthetic ethology:** studying behavior of artificial agents as behavior, including regularities, environmental interactions, and limits of observation. Do not substitute a story about motivations for analysis of explicit rules.
- **Umwelt (Uexküll):** the perceptual-action world available to a situated organism. In our code we specify *inputs available to an agent*; this is a useful operational analogy but does **not** prove a creature has lived experience.
- **Emergence:** patterns that arise through interactions among components and conditions. Whether a result counts as emergent must be argued at an appropriate level, not inferred from unexpected visuals.
- **Behavioral rule / mechanism:** the implemented local mapping from sensed input and state to action.
- **Mental model:** a player's predictive/explanatory representation of the system. A good test involves novel conditions, intervention choice, justified predictions, and revision.
- **Anthropomorphism / intentional stance:** attributing goals, knowledge or feelings to behavior. Such descriptions may be useful predictive shorthand, but cannot establish actual inner states.
- **Stigmergy:** interactions mediated through modifications to a shared environment (e.g., decaying traces).
- **Adaptation, learning, evolution:** separate phenomena. Within-life rule modification is not automatically evolution; genetic evolution needs variation, inheritance and selection. None is currently implemented.
- **Poetic hypothesis:** a line that is both a defensible inference and a literary account. An expressive ending may exceed the evidence; distinguish interpretive meaning from program-verifiable properties.

## Advisor guidance: Stephanie's critique (4 November 2026)

*Source: advisor notes supplied by the project author. These are questions, directions, and methodological cautions, not verified results or a settled dissertation framework.*

### Research direction and boundaries

**Overarching inquiry:** How can playable artificial-life systems produce encounters with unfamiliar forms of agency, and how do people construct knowledge about entities they observe, interpret, and experiment with rather than simply control?

This question remains exploratory. **Do not equate building an interesting simulation with a scholarly contribution.** Distinguish (a) a reproducible computational phenomenon, (b) speculative artistic staging of an encounter, and (c) empirical claims about what players perceive, believe, or learn. Each requires its own evidence.

Six questions to carry into research and prototyping:
1. What prompts an observer to attribute agency, intention, or intelligence to simulated organisms?
2. How do interventions in an ecosystem shape observation, interpretation and explanation?
3. When is behavior meaningfully unexpected from the underlying computation, rather than an authored illusion?
4. How does computational emergence relate to *perceived* emergence? Neither entails the other.
5. Can an encounter sustain curiosity, observation and model formation without reducing experience to predetermined quiz answers?
6. What do speculative simulations expose about the limits of human classification, and what remains a literary or philosophical interpretation rather than an empirical finding?

**Four distinct player activities to study, not collapse into one:** identifying a behavioral rule; constructing an explanatory model; performing deliberate experiments; projecting intentionality or agency. A player may do several, but completion of the current dropdown poem is evidence only of selecting the expected responses.

### Scholarly directions to engage selectively

- **Donna Haraway:** situated knowledge and multispecies relations. Ask whose perspective the interface makes available and what it omits.
- **Anna Tsing:** ecological entanglement and collaborative survival. Relevant when creature relations and environmental dependencies are actually implemented.
- **Cary Wolfe:** animal studies and posthumanist critique. Examine how anthropocentric classifications frame an unfamiliar agent.
- **Kathryn Yusoff:** environmental histories and politics of knowledge. A possible wider critique of classification and the authority of observation; justify any link to a concrete prototype.
- **Manuel DeLanda:** emergence and nonlinear systems; useful for articulating why patterns from local rules require real dynamical analysis.
- **Immanuel Wallerstein:** world-systems and large-scale relational structures; potentially useful at a different scale, not an automatic foundation of the first field study.
- **James Bridle, *Ways of Being*:** accessible entry into nonhuman intelligence and imagination, not a substitute for primary theory or computational research.

These are **reading leads**, not evidence that each thinker endorses the project's hypotheses. Prioritize sources that clarify a specific rule, interpretive operation, or evaluation method. Continue critical engagement with ALife and synthetic ethology literature alongside environmental humanities and philosophy of science.

### Methodological separation

| Object of analysis | Questions | Potential evidence | Current status |
| --- | --- | --- | --- |
| **Programmed mechanism** | Which local inputs and rules create which population-level patterns? | Explicit rules, seeds, parameter sweeps, measures, replication | Two-rule browser sketch; small non-equivalent pilot approximation |
| **Artistic encounter** | How do interface, poetry, visuals and timing position the observer? | Close design analysis, alternative interface conditions, documented revisions | Working playable prototype and informal critiques |
| **Observer attribution** | What agency, desire or intelligence does a player perceive? | Unprompted descriptions, predicted outcomes, post-intervention revisions, interviews | Informal observations only; no participant dataset |
| **Computational emergence** | What global effects arise from local interactions, under which settings? | Repeated simulations and appropriate dynamical baselines | Not yet established as a novel phenomenon |
| **Perceived emergence** | Which effects appear surprising, spontaneous, intentional or complex to players? | Player reports and behavior; comparisons with scripted or matched conditions | Not measured |

A potential first formal study should record **observation → initial hypothesis → prediction → intervention → revised explanation**, ideally before answer choices constrain the conceptual vocabulary. Do not declare that play improves understanding, produces empathy, or teaches transferable reasoning without appropriate evidence.

### Relationship to other work and potential publication

The Shakespeare/sonnet project investigates formal constraints and interpretation of an inherited cultural object. The ALife project investigates agency, ecological interpretation and inference in a simulated world. Both ask how people come to know through interaction with constrained systems, but **should retain distinct research questions, disciplinary genealogies, methods and artistic ambitions**.

**Possible milestone:** ALIFE 2027 research prototype. A submission-worthy contribution might compare reproducible agent dynamics with observer explanations under intervention. Do not choose the claimed contribution or paper type before an adequate literature comparison and actual results.

**Practical guidance:** Bring coursework in NetLogo, p5.js, behavioral modeling and possible future Godot development into increasingly specific experiments. Allow simulations, close reading, and artistic sketches to reshape the research question. Neither lock a dissertation thesis now nor use open-ended exploration as a reason to avoid specifying the next small test.

### Near-term investigable problem

**Working question for the next build:** When observing one unfamiliar, explicitly specified organism, what explanations do players spontaneously generate, and how do those explanations change after they predict and perform a targeted environmental intervention?

A strong first iteration need not demonstrate five species or a full ecosystem. It must reliably produce interpretable yet initially ambiguous behavior, reveal different consequences under controlled intervention, and preserve the observer's *pre-prompt* account. A correct dropdown answer is neither necessary nor sufficient evidence of improved understanding.

**Decision boundary:** Further research can change this question. Record why the next prototype supports it and what outcome would contradict expectations.

---

### Implementation update: field notes and first predator encounter (4 November 2026)

The browser prototype now contains a **partial implementation** of the proposed observation workflow: an optional initial field impression, optional prediction and optional revised explanation can be stored with the captured field poem. These fields are not required, timestamped separately, or elicited before the player sees the predefined categories. The present implementation therefore cannot be claimed to measure unbiased or prospective hypotheses.

The Howler study now places two Howlers among 22 Edglings. Howlers accumulate a simple hunger counter, detect Edglings within a radius and pursue/capture them. Edglings locally prefer favorable terrain but turn away from approaching hunters. Captured prey are restored after a fixed delay for playability, rather than reproduced. A visible howl pulse can be silenced independently of pursuit and prey movement. This is a **programmed non-causal signal comparison**, not evidence that real organisms communicate or that a player can detect causality.

**New validation tasks:** confirm browser behavior across several seeds; measure time to first capture, capture frequency and prey distribution inside/outside favorable habitat; compare howling on/off conditions with matched initial states; elicit observer explanations before and after silence; determine whether the text of the poem reveals the intended answer. Existing tests of habitat vs. neighbor attraction do not validate these mixed-species dynamics.

Other named glyph creatures do not yet have independent behavior models. The original habitat/social three-line scoring remains in the other encounters; the Howler now has a separate three-property answer key, but a correct answer is still not evidence of spontaneous model formation.

---

### Implementation note: Afterling field study 003 (4 November 2026)

A screenshot-led design review identified three failures in study 3: its glyph was too similar to other organisms, its behavior repeated the existing habitat mechanism, and the circular environment repeated the first encounter without adding a new inference problem.

The revised browser prototype introduces a small **stigmergic trace field**: Afterlings respond to local deposited marks; marks persist independently of their makers, decay over time and can be erased by the observer. The scene no longer contains the pale circular hollow. Instead it starts with two preseeded meandering paths, and agents deposit additional traces as they move. Its three poem choices ask separately about following, environmental memory and erasure.

This is a new *implemented experimental mechanism*, **not** evidence of robust emergent route formation or learning. The preseeded routes are designed initial conditions, not patterns generated by the simulation itself. It remains necessary to compare tracked and erased conditions across seeds, measure trace density and path overlap over time, and observe whether players infer causal distinctions rather than simply reading the visible lines as a clue. The player-facing erasure is a useful first intervention but does not yet establish an effective research protocol.

---

## Research-method decision: CA, agent worlds, and future evolution — 5 November 2026

*Status: implementation and proposed experiment are distinct from results. Do not treat this section as a novelty claim.*

**Question guiding the first extension:** If environmental marks spread and decay across neighboring cells, how does this change the paths available to a trace-sensing organism and what differences can an observer infer through intervention?

The Afterling's trace-field array already represented continuous local environmental state. The new local-neighborhood diffusion rule makes its dynamics closer to a **continuous-state cellular automaton** or explicit grid-based diffusion scheme. Agents then perceive and modify this shared field. The organism's sensory-world constraints are implemented in the agent code; the changing field is a separate dynamical layer.

**Baseline vs. variant:** compare no diffusion (existing per-cell decay) with controlled diffusion at fixed decay, deposition, starting paths, random seeds and number of agents. Measure marked area, path width, trace persistence, trajectory reuse and response after erasure. The reference scenario starts with *authored* paths, so do not attribute those initial routes to emergence. Compare both authored initialization and blank-start conditions eventually.

**GA + CA is established prior art, not a required next step.** A genetic algorithm can evolve an automaton's local rule table or parameters across generations. Mitchell, Crutchfield and Hraber, “Evolving Cellular Automata to Perform Computations: Mechanisms and Impediments,” *Physica D* 75 (1994), 361–391, [DOI](https://doi.org/10.1016/0167-2789(94)90293-3), is a direct example. Mordvintsev, Randazzo, Niklasson and Levin's [“Growing Neural Cellular Automata”](https://distill.pub/2020/growing-ca/) (2020) uses **differentiable learned update rules**, not standard genetic selection; the distinction matters.

**Evolutionary question for later:** If sensors or response strategies vary heritably under costs and ecological selection, which strategies persist in a world with diffusing traces and competing organisms? That requires an explicit genotype, reproduction, variation, actual selection and interpretable measurements. Adjusting diffusion or repeatedly rerolling random agent positions is **not evolution**.

**Scholarly limits:** CA-based environmental spread alone is not a new ALife mechanism. The research opportunity, if supported by future evidence, lies in what a playable interface reveals about the differences among what the world contains, what an organism can detect, and what an observer infers. Full literature comparison and participant evidence remain outstanding.

---

## 2. What is presently being tested

**Mechanism A, local habitat preference:** 24 agents wander; motion slows sharply within a circular favored patch. Their sensor is local membership in the patch; they do not navigate toward it or identify companions. Clustering can arise through greater dwell time.

**Mechanism B, neighbor attraction:** 24 agents steer toward nearby neighbors within a large perception radius. They do not react to the preferred habitat. The current absence of short-range repulsion produces a dense knot.

**Player controls:** relocate favored region, scatter agents, rerun initial conditions, record three poetic claims, and see which are unsupported.

**Operational logic:** compare observations both **before** and **after** interventions. Measure occupancy of the patch, mean nearest-neighbor distance, distribution of pairwise spacings / clusters, and time to renewed concentration. The first two readouts exist in code but are not always rendered in the active layout.

### Provisional research hypotheses (to try to disconfirm)
- **H1 Mechanism discrimination:** When two systems produce visually comparable grouping, interventions expose reliable differences in regrouping and patch occupancy.
- **H2 Inference revision:** Some players initially use social-intention narratives for environmentally caused accumulation; targeted tests can lead them to revise the causal account.
- **H3 Poetic scaffolding:** Lines that offer competing explanatory clauses can direct attention to diagnostic evidence. They may also bias an observer toward the predefined categories. Test both possibilities.
- **H4 Transfer to interaction:** Understanding isolated agents might support, fail to support, or mislead predictions when agents coexist and affect one another. This requires genuinely distinct species and new mixed encounters.

**Null or contrary findings to preserve:** mechanisms remain visually separable without intervention; poem options merely cue the answer; players correctly classify without explaining; extra constraints frustrate rather than teach; participants' performance does not transfer to a fresh organism.

## 3. Current model audit and methodological honesty

The code [sketch.js](../sketch.js) uses two models, not five distinct species. Names and glyph silhouettes cycle across studies. It should not be described publicly as an evolving ecosystem, computational discovery, multi-species ecology or measured change in human understanding.

An early pilot from the earlier standalone design note (consolidated into DESIGN.md and retained in Git history) used a *separate headless Python approximation* (8 seeds, 24 agents, 1200 update steps, habitat moved after 600). The average habitat occupancy values were 0.422 / 0.188 / 0.307 (habitat mechanism) and 0.797 / 0.000 / 0.000 (attraction) at steps 600 / 750 / 1200, respectively. Mean nearest-neighbor distance at step 600 was roughly 74.3 px vs 5.7 px. **This is preliminary engineering evidence about a simplified approximation, not validation of the p5 implementation or statistical significance.** The takeaway is that the comparison requires redesign.

### Modeling protocol to build
1. Freeze an explicit model specification (inputs, states, decision rules, numerical parameters, update rate, boundaries). Version changes with Git.
2. Use matched seeds and initial positions between A and B when possible; run many trials. Log raw outcome series to machine-readable files for analysis.
3. Predefine observable metrics: fraction in patch, density, mean nearest-neighbor distance, cluster count, largest cluster, time to concentration, position trajectories.
4. Add parameter sweeps for agent number, turning noise, attraction radius, short-range repulsion, patch size and speed differential.
5. Evaluate before/after moves and scattering with enough observation time; quantify variability instead of showing only representative screenshots.
6. Avoid making the simulation answer trivially visible through unmatched geometry or an interface clue.
7. Reproduce a small cross-check in an independent model or NetLogo where feasible, while documenting non-equivalence. NetLogo is a research comparison, **not** a requirement for the playable runtime.
8. Keep artistic behavior and scientific conclusions separate; if a poetic line says an organism *knows*, *desires*, or *grieves*, the code must not be mistaken for proof.

### Future participant protocol (none conducted formally)
- Recruit consented participants; record prior game and programming experience, relevant familiarity with simulation / p5.
- Initial unguided observation; capture verbatim first explanation **before** displaying leading hypothesis choices when possible.
- Record predicted response to a manipulation, actual intervention, observed result, and post-intervention explanation.
- Provide one transfer case with altered parameters or unfamiliar agents; distinguish identifying the original answer key from generalization.
- Compare, if appropriate, a poetic menu and a neutral/descriptive menu to test scaffold effects, keeping content equivalently diagnostic.
- Analyze errors and revision paths, not only correct captures. A single informal usability session is not evidence for a learning effect.
- If eventually claiming lasting transfer, design a separate delayed or unfamiliar task and comparison; do not extrapolate from an in-game score.

## 4. Research contribution to investigate, not claim

A potentially useful contribution is **a repeatable, playable interface for developing and revising causal accounts of artificial organisms**, with a close relationship between model parameters, visible behavior, interventions, and structured poetic field notes.

Novelty could exist at distinct levels:
1. **Model:** truly new rule system or interaction producing documented dynamics (not yet established).
2. **Playable encounter:** an interface that makes model assumptions available to investigation through aesthetically coherent interpretation (prototype underway).
3. **Empirical method:** evidence about how people form and revise models, possibly comparing representations and transfer tasks (not yet undertaken).

Do not claim these three together by default. Novelty needs actual comparison with ALife, science education, game design, artificial ethology, and ALife art.

## 5. Research workflow and provenance

This document combines (a) the project's own game-design discussions and first informal playtest; (b) the earlier *Speculative Artificial Ethology* reading archive, whose source-status cautions are retained; (c) official model/project descriptions and bibliographic leads. It is **not** a completed systematic review. “Contribution” below means a source's apparent theme or its reported result, not a fresh full-text verification undertaken here.

**Reading-status labels:** `Primary/official model description`, `abstract/description reviewed`, `lead: close reading pending`, `creative reference`, `bibliographic details to check`. Update these statuses only after actual reading. Keep stable links/DOIs, publication metadata, useful arguments, tensions, and design implications. Annotate *why the source matters*, not just what it is.

## 6. Annotated bibliography

### A. Umwelt, embodied perception, apparent intention

**1. Jakob von Uexküll. *A Foray into the Worlds of Animals and Humans, with A Theory of Meaning*. Trans. Joseph D. O'Neil, University of Minnesota Press, 2010.**  
**Question:** What forms of significance exist for an organism with particular sensors and effectors? **Use:** conceptual discipline for defining the Edgling's accessible world and distinguishing that world from the player's global view. **Caution:** code-defined sensory inputs do not establish qualia. **Next:** read the specific Umwelt examples and map perceptual cues to available actions. **Status:** theoretical lead; full passage-based analysis pending.

**2. James Bridle. *Ways of Being: Animals, Plants, Machines: The Search for a Planetary Intelligence*. Farrar, Straus and Giroux, 2022.**  
**Question:** Which assumptions limit what humans recognize as intelligence? **Use:** broad intellectual motivation for nonhuman agency and attention to other modes of sensing. **Tension:** expansive philosophical claims should not substitute for formalized behavior or experimental evidence. **Next:** locate passages on perception, machines and ecological relations and record page citations. **Status:** ongoing reading / close annotation pending.

**3. Valentino Braitenberg. *Vehicles: Experiments in Synthetic Psychology*. MIT Press, 1984. [Publisher](https://mitpress.mit.edu/9780262521123/vehicles/).**  
**Question:** How do simple sensor-to-motor couplings invite exaggerated interpretations of desire, fear or intention? **Use:** central comparative precedent for Hushling and for the tendency to anthropomorphize. **Next:** reproduce two contrasting vehicle circuits with controlled stimuli and write what an observer might misinfer. **Status:** reading lead.

**4. Daniel C. Dennett. *The Intentional Stance*. MIT Press, 1987.**  
**Question:** When is a belief/desire explanation a predictive strategy rather than evidence of literal mentality? **Use:** frame the distinction between meaningful interpretation and the internal implementation of Edgling behavior. **Next:** use specific passages to avoid treating every intentional description as simply incorrect. **Status:** reading lead.

**5. Malika Auvray, Charles Lenay, and John Stewart. “Perceptual Interactions in a Minimalist Virtual Environment.” *New Ideas in Psychology* 27, no. 1 (2009): 32–47.**  
**Question:** How does interactive sensorimotor coupling affect how an observer finds another agent? **Use:** precedent for minimal perceptual encounters, not proof that our browser game generates understanding. **Next:** check apparatus, conditions and outcome measures in full text. **Status:** archive lead; close reading pending.

### B. Agent-based ecologies, stigmergy, collective effects

**6. S. Dabholkar, T. Granito, and U. Wilensky. “Habitat Preference Behavior.” NetLogo Models Library, 2020. [Official model](https://ccl.northwestern.edu/netlogo/models/HabitatPreferenceBehavior).**  
**Reported mechanism:** agents show reduced movement when occupying a preferred environmental condition. **Use:** closest accessible comparative model for Edgling dwell-time dynamics; current p5 code is inspired by the principle but differs in environment, parameters and controls. **Next:** compare source code, measurement protocol and repeat trials. **Status:** official model description reviewed.

**7. U. Wilensky. “Ants.” NetLogo Models Library. [Official model](https://ccl.northwestern.edu/netlogo/models/Ants).**  
**Question:** Can local deposition and detection of environmental traces yield collective routes without explicit shared plans? **Use:** Afterling stigmergy, trace decay, memory outside the body. **Next:** list each pheromone update and test interruption/recovery. **Status:** official model lead, code inspection pending.

**8. U. Wilensky. “Flocking.” NetLogo Models Library. [Official model](https://ccl.northwestern.edu/netlogo/models/Flocking).**  
**Question:** Which local alignment, separation and cohesion rules produce coordinated movement? **Use:** Manyone, especially to correct our currently over-attractive collapsed grouping. **Next:** analyze personal-space and sensing parameters rather than copying just the birdlike visuals. **Status:** official model lead.

**9. U. Wilensky. “Slime.” NetLogo Models Library. [Official model](https://ccl.northwestern.edu/netlogo/models/Slime).**  
**Question:** How can many agents assemble into leaderless aggregation? **Use:** alternative Manyone mechanics and reconsideration of what counts as an “individual.” **Next:** compare chemical-mediated aggregation with flocking and direct attraction; decide which is the better inference puzzle. **Status:** official model description reviewed.

**10. U. Wilensky. “Wolf Sheep Predation.” NetLogo Models Library. [Official model](https://ccl.northwestern.edu/netlogo/models/WolfSheepPredation).**  
**Question:** How do resource growth, consumption, reproduction and population loss shape coupled populations? **Use:** a reference system for Mourner interdependence. **Caution:** predator-prey is not the same as mutualism. **Next:** specify the relationship we actually want and document resource state. **Status:** official model lead.

**11. Andrew Dorin, Kevin B. Korb, and Volker Grimm. “Artificial-Life Ecosystems: What Are They and What Could They Become?” *ALIFE XI*, 2008.**  
**Question:** What distinguishes an animated collection of agents from an ecological system? **Use:** a needed benchmark before calling the five-species version an ecology. **Next:** read full framework and compare feedback, resource dynamics and agent-environment coupling. **Status:** bibliography lead; full-text reading pending.

**12. Bert Wang-Chak Chan. “Lenia and Expanded Universe.” *ALIFE 2020*. [DOI](https://doi.org/10.1162/isal_a_00297).**  
**Question:** Can organism-like forms arise without individually scripted animal agents? **Use:** conceptual counterexample to equating ALife with movable sprites or multiple species. **Next:** identify what a continuum-based behavior puzzle would let players infer. **Status:** abstract / bibliographic lead.

**13. Nicholas Guttenberg et al. “On the Potential for Open-Endedness in Neural Networks.” *Artificial Life* 25, no. 2 (2019): 145–167. [DOI](https://doi.org/10.1162/artl_a_00286).**  
**Question:** What barriers limit ongoing novelty in artificial systems? **Use:** prevents using “open-ended” as an aesthetic adjective for procedural variation. **Next:** determine whether genuine open-endedness is even required for this first game. **Status:** publisher-abstract level.

**14. A. Croft, C. Johnson, A. Vostinar, and C. Dolson. “On the de novo Evolution of Mutualism in Symbulation.” *ALIFE 2024*. [DOI](https://doi.org/10.1162/isal_a_00790).**  
**Question:** Under what evolutionary conditions can cooperative relationships emerge? **Use:** compare with any future Mourner mutualism claim. **Next:** inspect implementation, ecological assumptions and experimental controls. **Status:** ALIFE proceedings discovery lead; methods unread.

**15. N. Randazzo and A. Mordvintsev. “Simulating an Artificial Biome of Plants with Biomaker CA.” *ALIFE 2024*. [DOI](https://doi.org/10.1162/isal_a_00814).**  
**Question:** How do cell-based artificial environments generate life-like plant forms and ecological structure? **Use:** counterpoint to the agent-centered approach and possible later environmental behavior. **Next:** inspect environmental resources, competing organisms and metrics. **Status:** proceedings lead; full read pending.

### C. Play, inference, scaffolding and the research instrument

**16. D. DeLiema et al. “Playful Learning Following Deviations: A Mixture of Tinkering, Causal Explanations, and Revision Rationales.” *International Conference of the Learning Sciences*, 2022. [Repository](https://repository.isls.org/handle/1/8947).**  
**Reported theme:** exploratory responses to deviations in *Baba Is You*, including causal explanations and revision. **Use:** candidate coding vocabulary for observation → surprise → hypothesis change. **Next:** close-read participant method, analysis and limitations before using as evidence of learning. **Status:** repository/abstract-level review in source archive.

**17. Z. Carpenter and D. DeLiema. “Learning Through Play at the Intersection of Problem-Solving, Epistemic (Un)certainty, and Emotion.” *ICLS*, 2023. [Repository](https://repository.isls.org/handle/1/9873).**  
**Reported theme:** relations among puzzle-solving, uncertainty and emotion. **Use:** consider frustration versus productive doubt; our first tester could not tell a wrong theory from a broken interface. **Next:** read full measures and findings, avoid extrapolating. **Status:** abstract-level review.

**18. Z. Carpenter, N. Eshgarf, A. Reshi, and C. G. Anderson. “How General Game Expertise Shapes Player Experience and Problem-Solving Across Different Onboarding Approaches in a Puzzle Video Game.” *DiGRA*, 2026. [DOI](https://doi.org/10.26503/dl.v2026i3.2820).**  
**Question:** What role do prior gaming skills play in learning and exploration? **Use:** participant-experience covariate in any field-guide study. **Next:** read full statistical treatment and evaluate whether a small pilot can support comparison. **Status:** publication identified; close reading pending.

**19. S. Cooper et al. “Predicting Protein Structures with a Multiplayer Online Game.” *Nature* 466 (2010): 756–760. [DOI](https://doi.org/10.1038/nature09304).**  
**Reported contribution:** *Foldit* players explore complex protein-folding search spaces. **Use:** precedent for consequential investigation through playable representations, not directly for artificial ethology. **Next:** separate discovery by optimization from identification of a hidden mechanism. **Status:** publisher abstract identified.

**20. S. Cooper et al. “Algorithm Discovery by Protein Folding Game Players.” *PNAS*, 2011. [DOI](https://doi.org/10.1073/pnas.1115898108).**  
**Reported contribution:** players can create strategies reusable in computational search. **Use:** a stronger precedent for examining *how* a player constructs a method, not only whether they find an answer. **Next:** verify full metadata, strategy analysis and transfer scope. **Status:** indexed abstract noted in source archive.

**21. E. B. Speth et al. “Using Avida-ED for Teaching and Learning about Evolution in Undergraduate Introductory Biology Courses.” *Evolution: Education and Outreach* 2 (2009): 415–428. [DOI](https://doi.org/10.1007/s12052-009-0154-z).**  
**Question:** How can simulation become an instrument for asking evolutionary questions? **Use:** comparison for experimental affordances, feedback and misconceptions. **Caution:** our prototype implements no evolutionary process yet. **Next:** read pedagogy and limits. **Status:** article excerpt / lead.

### D. Artistic encounters, interpretive form and speculative natural history

**22. Ed Key and David Kanaga. *Proteus*. 2013. [Project site](https://www.visitproteus.com/).**  
**Use:** an immersive, sensory world that rewards attention and lingering without demanding a conventional explanation for every phenomenon. **Tension:** *Browser Bestiary* asks for causal inference; *Proteus* is not automatically an artificial-ethology experiment. **Next:** keep a close-play log of how music, distance, and season guide noticing. **Status:** creative reference; comparison to be deepened.

**23. Ice Water Games. *Eidolon*. 2014. [Steam](https://store.steampowered.com/app/286140/).**  
**Use:** environmental traces and reconstruction of a world from partial artifacts; distinct from continuously simulated social organisms. **Next:** compare physical exploration and archival inference. **Status:** creative reference; close-play pending.

**24. Jump Over the Age. *In Other Waters*. 2020. [Steam](https://store.steampowered.com/app/890720/).**  
**Use:** constrained scanning and xenobiological field observation, a particularly close interface precedent for studying an inaccessible living world. **Next:** sketch its flow from signal to classification to narrative claim. **Status:** creative reference; close-play pending.

**25. Videocult. *Rain World*. 2017. [Steam](https://store.steampowered.com/app/312520/).**  
**Use:** organism behaviors and ecological dangers not organized solely around the player's task. **Next:** distinguish authored systems, procedural complexity and learned player expectations. **Status:** creative reference.

**26. Color Gray Games. *The Case of the Golden Idol*. 2022. [Steam](https://store.steampowered.com/app/1677770/).**  
**Use:** causal reconstruction via selecting words/roles in a statement. The browser bestiary's poem uses a related hypothesis-assembly pleasure, but studies behavior rather than a fixed murder scene. **Next:** analyze why some words are informative, misleading or redundant. **Status:** creative reference; mechanic discussed, full analysis pending.

**27. Lucas Pope. *Return of the Obra Dinn*. 2018. [Project site](https://obradinn.com/).**  
**Use:** evidence-gated deduction and the affect of discovery; compare player certainty, identity guessing and explicit validation. **Next:** consider how an evolving ecosystem would differ from reconstructing a predetermined past. **Status:** creative reference.

**28. Eugene An, Rook Liu, Matt Mora, and Beckett Rowan, with music by Jenny Beck. *goodbye.monster*. [Playable site](https://goodbye.monster/).**  
**Use:** a browser-native affective encounter whose typography, interaction staging and shifting screen composition make intimate creature relations feel tangible. **Difference:** not a technical reference for multi-agent causal inference; an atmospheric and interface precedent. **Next:** capture an interaction sequence and analyze what persists versus rearranges between states. **Status:** played/referenced in screenshots; technical method not established.

**29. Zhu Yingchun. *Cacaform Birds* (artist book; confirm edition metadata before formal citation).**  
**Use:** visual speculative taxonomy with watercolor-like organisms and tiny natural-history descriptions, a direct aesthetic touchstone for a field guide whose entries are poems. **Next:** identify exact publication/edition, record the actual page and wording of inspirations, and avoid copying specific creature designs or text. **Status:** primary visual reference supplied by project creator; bibliography incomplete.

**30. Jeff VanderMeer. *Annihilation*. Farrar, Straus and Giroux, 2014.**  
**Use:** ecological estrangement and observation that destabilizes familiar categories; useful for writing encounters that resist premature naming. **Caution:** literary case, not ALife evidence. **Next:** track passages about observation and contamination of scientific language. **Status:** literary reference.

**31. Donna J. Haraway. *Staying with the Trouble: Making Kin in the Chthulucene*. Duke University Press, 2016.**  
**Use:** relational life and making-with, especially if the later game makes each organism's possibilities depend on others. **Caution:** do not turn sympoiesis into a synonym for “creatures together.” **Next:** identify passages applicable to concrete reciprocal mechanisms. **Status:** theoretical lead.

**32. Tsing, Swanson, Gan, and Bubandt, eds. *Arts of Living on a Damaged Planet: Ghosts and Monsters of the Anthropocene*. University of Minnesota Press, 2017.**  
**Use:** attentive noticing of multispecies entanglement, disturbance and traces. **Next:** annotate specific chapters rather than attributing a single thesis to the collection. **Status:** chapter-level reading pending.

**33. J. Prophet and H. Pritchard. “Performative Apparatus and Diffractive Practices: An Account of Artificial Life Art.” *Artificial Life* 21, no. 3 (2015): 332–343. [DOI](https://doi.org/10.1162/ARTL_a_00174).**  
**Use:** a close theoretical bridge between ALife artwork, performance, interpretive apparatus and participation. **Next:** compare experimental observer positions to the playable field-guide apparatus. **Status:** full-text source located in previous archive; close reading pending.

**34. Z.-W. Wu, H. Qu, and K. Zhang. “A Survey of Recent Practice of Artificial Life in Visual Art.” *Artificial Life* 30, no. 1 (2024): 106–135. [DOI](https://doi.org/10.1162/artl_a_00433).**  
**Use:** place the project among existing ALife art, including autonomous environments, evolutionary selection and audience interaction. **Next:** create a precedent matrix rather than novelty by mood alone. **Status:** article description/excerpts read in earlier archive.

**35. Joel Simon. *Evolving Alien Corals* (2018). [Project](https://www.joelsimon.net/corals).**  
**Use:** visual speculative biology generated through environmental constraints and selection. **Distinction:** different optimization and human-selection logic from our behavioral observation puzzle. **Next:** compare the artist's stated fitness criteria and representational choices. **Status:** creator description; technical details unverified.

### E. High-priority ALIFE literature screen: not yet exhaustive

**36. Forbes and Beer. “Deriving Community Models with Evolutionary Robotics: A Case Study of Sensory Pollution.” *ALIFE 2024*. [DOI](https://doi.org/10.1162/isal_a_00738).** Candidate for environmental mediation and unexpected social consequences. Read methods and scope before any novelty claim.

**37. Skuljan, Erb, and Egbert. “Dynamics of Human Exploration of Novel Sensorimotor Contingencies.” *ALIFE 2024*. [DOI](https://doi.org/10.1162/isal_a_00741).** Potentially very close to human exploration of unfamiliar sensorimotor rules. Need a full methods audit.

**38. Srinivasan, Le, Bongard, and Blackiston. “Evolving Agents to Generate and Falsify Hypotheses of Biological Self-Assembly.” *ALIFE 2025*. [DOI](https://doi.org/10.1162/ISAL.a.852).** Candidate prior art on computational hypothesis generation and falsification; compare what the model does versus what a human player learns. Full text pending.

**39. Moreno, Rodriguez-Papa, and Dolson. “Ecology, Spatial Structure, and Selection Pressure Induce Strong Signatures in Phylogenetic Structure.” *Artificial Life*, 2025. [DOI](https://doi.org/10.1162/artl_a_00470).** Relevant to disentangling spatial structure from ecological/evolutionary mechanisms; don't project its findings onto the toy models without reading.

**Proceedings to screen comprehensively later:** [International Society for Artificial Life past conferences](https://alife.org/conferences/conferences-isal-past/) and [ALIFE 2026 volume 38](https://direct.mit.edu/isal/isal2026/volume/38). Existing 2024–26 coverage is targeted discovery, **not** a complete review.

## 7. Literature gaps and next reading actions

Priority order:
1. **Closest agent precedents:** inspect exact source/update rules for Habitat Preference Behavior, Ants, Flocking and Slime. Write comparative mechanisms and which tests discriminate them.
2. **Closest inference research:** read DeLiema, Carpenter, Skuljan and Auvray in full. Extract participant tasks, elicitation method, model-revision measures and limits.
3. **Closest playable precedents:** close-play *In Other Waters*, *Golden Idol*, *Proteus* and *goodbye.monster*; document real interface mechanics rather than treating them all as examples of “discovery.”
4. **ALife/art novelty audit:** read Prophet & Pritchard, Wu et al., Dorin et al., then screen ALIFE 2024–26 proceedings systematically.
5. **Theoretical specificity:** select close passages from Uexküll, Braitenberg, Dennett and Haraway; place philosophical claims beside the tiny formal models they can actually clarify.
6. **Bibliographic cleanup:** check edition and full metadata for Zhu Yingchun; verify author lists/page numbers for entries marked provisional; add accessible copies where lawful.

**Novelty comparison matrix to maintain:** source / computational representation / sensors / behavioral rules / ecological feedback / interface to observer / allowable interventions / interpretive task / empirical evidence / limitations / relationship to Browser Bestiary.

## 8. Research log: questions we should not quietly forget

- If a poetic option directs a player toward the answer, does it teach inference or simply shape attention to a preselected interpretation?
- Can player-generated free-text hypotheses be recorded without losing reliable scoring? Perhaps separate a free naturalist's note from three testable structured claims.
- How should uncertainty persist after a “correct” poem, especially when the model's subjective life remains underdetermined?
- What happens when different rules produce the **same** population-level summary but different responses to relocation or dispersal?
- How can an agent with local sensing be represented visually without granting the player an omniscient privileged explanation?
- What makes a creature “transformative”: internal state changes, environmental modification, evolution, or the **observer's changed model**? These are distinct research questions.
- Can a five-species combination yield surprising new dynamics that a trained player predicts better than a novice? Would that justify a playable ethnographic or quasi-experimental study?
- Is the current classification task sufficient for an ALife conference poster/demo, and what additional computational results or user data would justify a full paper?
- Which existing ALife art pieces already use model explanation, interpretation or audience interventions? Investigate before asserting uniqueness.
- Does an agent's apparent sadness belong to the animal, the field poem, or the observer's projection? This is a creative and epistemological issue, not a parameter.

## 9. Change log and maintenance rule

**4 Nov 2026 (prototype update):** Documented optional pre/post interpretation fields and the preliminary Howler–Edgling mixed encounter, including the lack of verified experiments or formal player observations.\n\n**4 Nov 2026 (advisor update):** Incorporated Stephanie's research critique as an explicitly provisional section: distinguish computational and perceived emergence; analyze observer attribution separately from underlying mechanics; keep the dissertation horizon open.\n\n**4 Nov 2026:** Separated research/bibliography from design while preserving the earlier research archive's limitations and status. Documented current implementation, preliminary pilot, proposed learning measures and future five-creature research directions. No new behavioral experiment or completed literature review is claimed by this documentation update.

**Updating this file:** New scholarly sources get full citations, stable links, what they *actually* establish, why they matter, next reading and status. New empirical claims require method, data, comparison and limitations. Creature visuals, UX and formative playtest notes belong in [DESIGN.md](DESIGN.md); findings about model rules or player inference can be summarized here when supported. The earlier *Speculative Artificial Ethology* archive remains a broader research source, not something this repo silently replaces.
