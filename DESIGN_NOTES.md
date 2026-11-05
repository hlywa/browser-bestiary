# Browser Bestiary / Field Study 001
## The Edgling: behavioral design and pilot notes
2026-11-03

### Why this encounter exists
A gathering may look like companionship even if no individual can perceive other individuals. The intended player discovery is the difference between *sharing a favorable place* and *seeking company*. The goal is to build an intuitive mental model by making a prediction, altering conditions, and revising it, not simply selecting a poetically attractive phrase.

### Umwelt (explicit simulation assumptions)
An Edgling can sense only whether the patch beneath it is favorable. It does **not** sense other Edglings, distant favorable terrain, social hierarchy, or the location of the habitat's center. This is a model of limited environmental sensing, **not** a claim about subjective experience.

### Current underlying rules
- World: 1000 x 560; a circular favorable region initially centered at (620,270), radius 155.
- 24 agents; initial locations and headings pseudo-randomized.
- Habitat mechanism: agents change heading randomly by up to +/- 0.5 radians per update. Step length is 0.23 inside the favorable region and 2.2 elsewhere. This makes agents linger rather than navigate toward the region.
- Comparison mechanism: agents sense neighbors within radius 520 and steer toward their average location, with a capped turn and noise. They have no information about the favorable region.
- Interventions: move the favorable region, scatter agents, rerun a trial.

### Expected observable differences
- Habitat mechanism: diffuse occupancy of the favorable area, without deliberate reunion. Moving the region does not cause immediate pursuit. New occupancy can develop through wandering.
- Social mechanism: tighter grouping that follows neighbors rather than the marked region. Dispersing the group may produce reunion if separated agents remain within sensing distance.

### Pilot test (not a player study)
A separate headless Python approximation tested the specified rules over 8 deterministic initial seeds, 24 agents each, for 1200 updates, moving the favorable region after update 600. This is a quick engineering diagnostic, **not** a validated equivalent of the browser implementation or a general statistical result.

Average fraction of agents within the favorable region:
| Rule | Update 600 (before move) | 750 (after move) | 1200 (after move) |
| --- | ---: | ---: | ---: |
| Habitat dwell time | 0.422 | 0.188 | 0.307 |
| Neighbor attraction | 0.797 | 0.000 | 0.000 |

Approximate mean nearest-neighbor distance at update 600:
- Habitat: 74.3 px
- Neighbor attraction: 5.7 px

**Finding:** The present mechanisms are much too easy to distinguish spatially. Neighbor attraction creates a tiny dense knot, whereas habitat preference creates looser accumulation. The current game should not claim that the two mechanisms necessarily produce near-identical visible gatherings.

### Next controlled design pass
1. Add a simple, visible field record of occupancy and spacing over time, without revealing the rule.
2. Tune the social mechanism with finite personal space / short-range repulsion and a smaller attraction range so it forms a legible loose gathering, not a collapsed knot. Preserve a measurable difference in response to interventions.
3. Test more seeds, matched initial states, response time after moving habitat, nearest-neighbor spacing, and occupancy. Document limitations and compare with the browser p5.js implementation.
4. Redesign the Edgling poem only **after** observations support each possible answer:
   - Habitat: where does it linger?
   - Behavior: what happens when its conditions change?
   - Mechanism: does it sense neighbors, or only the local environment?
5. Ask a player to make a prediction before an intervention and check whether the explanation transfers, rather than treating a correct multiple-choice answer alone as evidence of understanding.

### Poetic direction (provisional, not yet the answer key)
> Where the ground is kind, it lingers.  
> It has no eyes for those beside it.  
> They spend their little lives together, never knowing.

The third line is metaphorical: absence of a neighbor-sensing rule does **not** establish the creature's subjective experience. Its inferential counterpart should explicitly describe the missing sensing mechanism.

### Constraints
Keep the black-and-white browser composition, the left book glyph, and bottom bestiary. Do not add all four species before the Edgling's behavior, intervention, and inference loop are legible.
