---
name: Scenario mode-based branching architecture
description: How the NPC personality picker works in the scenario screen and how to add/extend modes.
---

## Rule
Each scenario in `data/scenarios.ts` can have an optional `modes?: ScenarioMode[]` array. If present, `scenario/[id].tsx` shows a full-screen mode picker before the conversation starts. The selected mode's `firstStepId` replaces `scenario.firstStepId` as the conversation entry point.

**Why:** Different NPC personalities need completely different entry steps (Informed Server vs Uninformed Server have structurally different opening moves). A single `firstStepId` per scenario can't branch on personality before the chat begins.

**How to apply:**
- When adding a new scenario personality, add a `ScenarioMode` entry to `modes[]` with its own `firstStepId` pointing to a new entry step.
- Mode-specific steps should stand alone (their own greeting/setup) and can merge back into shared steps wherever the path converges (e.g. `manager_to_rescue`, `end_own_food`).
- If a shared intermediate step leads to the wrong NPC response for a given mode, duplicate that step with a mode-specific `id` rather than repurposing the shared one (e.g. `receptive_bob_reveals_soy` vs `bob_reply_1_actual` both show the same speech but with different `nextStepId`s on the explain option).
- The `selectedMode` state in `[id].tsx` is `ScenarioMode | null`. The picker shows whenever `scenario.modes?.length` is truthy and `selectedMode` is null. A "Change" badge in the conversation header lets users restart in a different mode.

## Current modes per scenario
- Restaurant: Informed Server (`informed_start`), Uninformed Server (`uninformed_start`)
- Family Cookout: Receptive Relative (`receptive_start`), Pushy Relative (`pushy_start`)
- Catered Event: Helpful Coordinator (reuses `start`), Dismissive Coordinator (`dismissive_start`)
