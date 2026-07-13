# Pixel Roadside Pause Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current UI-led mini-game with a high-detail, single-scene pixel-art journey in which a Harajuku-styled driver parks, gets a cold drink, and receives an uplifting sign message.

**Architecture:** Keep the app static and dependency-free. `game-state.mjs` remains a pure state machine, while scene-specific DOM rendering is split into modules for the driver, interactive targets, and scene palette so each component owns one visual responsibility.

**Tech Stack:** HTML5, CSS3, Vanilla ES modules, Node built-in test runner, PNG pixel-art assets, GitHub Pages.

## Global Constraints

- Render a responsive 16:9 scene designed at 1280 × 720 or larger.
- Use `assets/car-white.png` as the visual anchor: crisp pixel edges, dark outline, blocky shadow, and pale-purple highlights.
- Use pixel-art PNG assets for the road, shop, sky, vending machine, driver, and effects; no smooth gradients or emoji art assets.
- The driver is a Harajuku-styled woman with half-red, half-black hair.
- Show text only as a short interaction cue or the final neon-sign message.
- Final message copy is limited to the three approved Thai strings in the redesign spec.
- The valid journey is car door → vending machine → neon sign → departure/restart.
- No timer, score, loss state, card, modal, page heading, or footer outside the game scene.
- All targets are semantic buttons and support mouse, touch, Enter, Space, `aria-label`, `aria-live`, and `prefers-reduced-motion`.
- All project asset paths are relative for GitHub Pages.

---

### Task 1: Establish pixel-art asset set and scene markup

**Files:**
- Create: `assets/scenes/roadside-shop-1280.png`
- Create: `assets/sprites/driver-harajuku.png`
- Create: `assets/sprites/vending-cold-drink.png`
- Modify: `index.html`
- Test: `test/scene-markup.test.mjs`

**Interfaces:**
- Produces `#scene`, `#car-button`, `#vending-button`, `#sign-button`, `#driver`, `#cue`, `#neon-message`, and `#live-region` for renderer modules.
- Assets are 1280 × 720 scene background, transparent driver sprite sheet, and transparent vending/drink sprite.

- [ ] **Step 1: Write the failing scene-markup test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the game page contains only in-scene interactive targets', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const id of ['scene', 'car-button', 'vending-button', 'sign-button', 'driver', 'cue', 'neon-message']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(html, /mini-game|result-card|control-card|<footer/);
});
```

- [ ] **Step 2: Run the markup test and confirm it fails on missing IDs**

Run: `node --test test/scene-markup.test.mjs`
Expected: FAIL because at least `car-button` and `neon-message` do not exist.

- [ ] **Step 3: Generate and validate the art assets**

Use image generation with `assets/car-white.png` as a style reference only. Generate the 1280 × 720 roadside scene without car/driver, a transparent sprite sheet of the Harajuku driver with half-red/half-black hair in four poses (standing by car, walking right, receiving drink, looking up), and a transparent vending/drink sprite. Remove a chroma-key background when needed, inspect each asset, and keep only final PNGs in the paths above.

- [ ] **Step 4: Replace the page markup with the scene component shell**

Use this target structure:

```html
<main id="scene" class="scene" aria-label="ร้านขนม pixel art ริมถนน">
  <img class="scene-background" src="assets/scenes/roadside-shop-1280.png" alt="" />
  <button id="car-button" class="target target-car" type="button" disabled aria-label="แตะประตูรถเพื่อพัก"></button>
  <img id="driver" class="driver" src="assets/sprites/driver-harajuku.png" alt="ผู้หญิงสไตล์ฮาราจูกุผมครึ่งแดงครึ่งดำ" />
  <button id="vending-button" class="target target-vending" type="button" disabled aria-label="กดตู้เพื่อรับน้ำเย็น"></button>
  <button id="sign-button" class="target target-sign" type="button" disabled aria-label="ดูข้อความบนป้ายไฟ"></button>
  <p id="cue" class="cue" role="status"></p>
  <p id="neon-message" class="neon-message" hidden></p>
  <p id="live-region" class="sr-only" aria-live="polite"></p>
</main>
```

- [ ] **Step 5: Run the markup test and commit**

Run: `node --test test/scene-markup.test.mjs`
Expected: PASS.

```bash
git add index.html assets/scenes assets/sprites test/scene-markup.test.mjs
git commit -m "feat: add high-detail roadside scene assets"
```

### Task 2: Model the meaningful three-interaction journey

**Files:**
- Modify: `game-state.mjs`
- Modify: `test/game-state.test.mjs`

**Interfaces:**
- Consumes event names `car-arrived`, `tap-car`, `driver-reached-vending`, `tap-vending`, `driver-returned`, `tap-sign`, `departure-finished`, and `restart`.
- Produces `{ phase, driverPose, activeTarget, cue, message, palette }`.

- [ ] **Step 1: Add failing tests for driver events and approved copy**

```js
test('driver movement gates each target and finishes with approved copy', () => {
  let state = createGameState(0);
  for (const event of ['car-arrived', 'tap-car', 'driver-reached-vending', 'tap-vending', 'driver-returned', 'tap-sign']) {
    state = transition(state, event);
  }
  assert.equal(state.phase, 'message');
  assert.equal(state.driverPose, 'looking-at-sign');
  assert.equal(state.activeTarget, 'sign');
  assert.equal(state.message, 'ยิ้มหน่อยสิ ออกจะน่ารัก');
});
```

- [ ] **Step 2: Run the state test and confirm it fails**

Run: `node --test test/game-state.test.mjs`
Expected: FAIL because movement events and state fields are undefined.

- [ ] **Step 3: Implement the event-gated state machine**

Implement `createGameState(messageIndex = 0)` and `transition(state, event)` so only this sequence advances: `arriving → parked → walking-to-vending → vending-ready → walking-back → sign-ready → message → departing → arriving`. Set `activeTarget` to `car`, `vending`, `sign`, or `null`; choose message from the three approved strings by `messageIndex % 3`.

- [ ] **Step 4: Run all state tests and commit**

Run: `node --test test/game-state.test.mjs`
Expected: PASS.

```bash
git add game-state.mjs test/game-state.test.mjs
git commit -m "feat: add event-gated calming journey state"
```

### Task 3: Render isolated scene components and animation phases

**Files:**
- Create: `components/scene-renderer.mjs`
- Create: `components/driver-renderer.mjs`
- Create: `components/target-renderer.mjs`
- Modify: `script.js`
- Modify: `style.css`
- Test: `test/renderer-contract.test.mjs`

**Interfaces:**
- `renderScene(state, elements)` sets `data-phase`, palette class, cue, and neon message visibility.
- `renderDriver(pose, element)` assigns `data-pose` values `in-car`, `exiting`, `walking-right`, `drinking`, `walking-left`, and `looking-at-sign`.
- `renderTargets(activeTarget, targets)` enables exactly one target button or none.

- [ ] **Step 1: Write the failing renderer contract tests**

```js
test('target renderer enables only the active target', () => {
  const car = { disabled: true };
  const vending = { disabled: true };
  const sign = { disabled: true };
  renderTargets('vending', { car, vending, sign });
  assert.deepEqual([car.disabled, vending.disabled, sign.disabled], [true, false, true]);
});
```

- [ ] **Step 2: Run renderer tests and confirm they fail**

Run: `node --test test/renderer-contract.test.mjs`
Expected: FAIL because renderer modules do not exist.

- [ ] **Step 3: Implement the three renderer modules**

Keep DOM access out of `game-state.mjs`. `scene-renderer.mjs` handles copy and `data-palette`; `driver-renderer.mjs` handles pose classes; `target-renderer.mjs` controls button disabled state and the one active cue. `script.js` owns only DOM queries, event listeners, animation-end events, dispatch, and restart.

- [ ] **Step 4: Replace CSS with component-scoped pixel layout**

Use `#scene` as the only visible page surface. Scale its 1280 × 720 art with `aspect-ratio: 16 / 9`, `image-rendering: pixelated`, and no surrounding card. Position target buttons as invisible but focus-visible hit areas over art. Use explicit pixel-shadow and palette variables; do not use emoji, smooth gradients, global display fonts, or UI panels.

- [ ] **Step 5: Run renderer and state tests, then commit**

Run: `node --test test/game-state.test.mjs test/renderer-contract.test.mjs`
Expected: PASS.

```bash
git add components script.js style.css test/renderer-contract.test.mjs
git commit -m "feat: render roadside journey components"
```

### Task 4: Wire animation timing, accessibility, and final static checks

**Files:**
- Modify: `script.js`
- Modify: `style.css`
- Modify: `index.html`
- Test: `test/scene-markup.test.mjs`

**Interfaces:**
- Dispatches movement-complete events from CSS `animationend`; reduced-motion dispatches the matching completion event immediately after render.
- Produces a replayable scene after `departure-finished`.

- [ ] **Step 1: Add a failing test for no external UI and all asset paths**

```js
test('all scene assets use relative paths and no external UI shell remains', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /<header|<footer|modal|dialog/);
});
```

- [ ] **Step 2: Run the test and confirm it fails if stale shell markup remains**

Run: `node --test test/scene-markup.test.mjs`
Expected: FAIL until stale external page markup is removed.

- [ ] **Step 3: Add lifecycle animation and reduced-motion handling**

Map driver animation names to `driver-reached-vending` and `driver-returned`, map car departure to `departure-finished`, and use a short state-driven completion fallback only when reduced motion is enabled. Preserve visible final poses without waiting for a long animation.

- [ ] **Step 4: Run the full verification set**

Run: `node --test test/*.test.mjs && node --check script.js && git diff --check`
Expected: all tests pass, JavaScript parses, and Git finds no whitespace errors.

- [ ] **Step 5: Smoke test GitHub Pages paths and commit**

Run: `python3 -m http.server 4173`
Expected: opening `http://localhost:4173/` loads the scene and each URL under `assets/` returns HTTP 200.

```bash
git add index.html style.css script.js test/scene-markup.test.mjs
git commit -m "feat: finish accessible pixel roadside journey"
git push origin main
```

## Self-review

- Spec coverage: Tasks 1 and 3 enforce the high-detail shared pixel-art visual system and component boundaries; Task 2 implements the meaningful journey and approved copy; Task 4 covers interaction, accessibility, motion preferences, and static hosting.
- Completeness scan: every task names concrete files, interfaces, test content, command, and expected result.
- Type consistency: state fields and events are declared in Task 2 and consumed with the same names by Tasks 3 and 4.
