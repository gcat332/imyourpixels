# Pixel Mood Booster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page pixel-art Japanese 90s snack stop where a JDM car arrives, the visitor completes a gentle mini-game, and leaves feeling lighter.

**Architecture:** A dependency-free static site separates the page shell, visual styles, and interaction state into `index.html`, `style.css`, and `script.js`. CSS handles the side-scrolling pixel scene and transitions; JavaScript owns the state machine, mini-game, randomized messages, sound opt-in, keyboard/touch activation, and reduced-motion behavior.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, SVG/CSS pixel-art shapes, GitHub Pages.

## Global Constraints

- Use HTML, CSS and Vanilla JavaScript as a static site.
- Every visual element must fit the pixel-art Japanese 90s snack-stop direction.
- No backend, analytics, login, or personal data.
- The primary car is a blue-purple Nissan Skyline GT-R R32; structure may support RX-7 FC/FD and RX-5 later.
- No loss state or timer in the mini-game.
- Sound is opt-in and the site works without sound.
- Support mouse, keyboard, touch, responsive mobile layout, and `prefers-reduced-motion`.
- Keep GitHub Pages project-path-safe by using relative asset URLs.

---

### Task 1: Create the static page shell

**Files:**
- Create: `index.html`
- Create: `assets/.gitkeep`

**Interfaces:**
- Produces DOM hooks consumed by `style.css` and `script.js`: `#scene`, `#car`, `#shop`, `#main-action`, `#mini-game`, `#message`, `#sound-toggle`, and `#live-region`.

- [ ] **Step 1: Create semantic HTML with the complete screen structure**

Use a `main` landmark containing a header, an `aria-live` status region, a scene section with a decorative sky/road/shop/car, a controls panel, and a mini-game panel. Use buttons for every interaction and include visible Thai labels.

- [ ] **Step 2: Add responsive and accessibility metadata**

Set UTF-8, viewport, title `แวะมายิ้มก่อน — Pixel Mood Booster`, `lang="th"`, `aria-label` values on the two icon-style controls, and `aria-live="polite"` on `#live-region`.

- [ ] **Step 3: Verify the shell loads without JavaScript**

Run: `python3 -m http.server 4173`
Expected: opening `http://localhost:4173` shows all text and buttons, even before styling or scripting is added.

- [ ] **Step 4: Commit the page shell**

```bash
git add index.html assets/.gitkeep
git commit -m "feat: add pixel mood booster page shell"
```

### Task 2: Build the pixel-art scene and responsive visual system

**Files:**
- Create: `style.css`

**Interfaces:**
- Consumes the IDs and classes from `index.html`.
- Produces visual states `.is-arriving`, `.is-parked`, `.is-playing`, `.is-finished`, and `.is-departing` for `script.js`.

- [ ] **Step 1: Define the palette, pixel rendering, and layout primitives**

Define CSS variables for pastel sky blue, cream, pink, neon red, purple-blue car paint, dark ink, and grass green. Set `image-rendering: pixelated`, a readable pixel-style font stack with Thai fallbacks, `box-sizing: border-box`, and a centered scene with `aspect-ratio` so it scales on desktop and mobile.

- [ ] **Step 2: Draw the side-view 90s Japanese snack stop with CSS**

Use layered gradients and box-shadows for clouds, sunset stripes, utility poles, road markings, the snack shop, neon sign, vending machine, awning, counter, and snack boxes. Keep the art intentionally blocky with hard edges and no gradients on interactive controls.

- [ ] **Step 3: Draw the R32 and supporting pixel objects**

Create the R32 from blocky CSS elements: body, roof, windows, wheels, headlights, grille, spoiler, and purple-blue highlights. Add a small mascot at the shop counter and hidden decorative RX-7/RX-5 silhouettes that can be activated later without changing the layout.

- [ ] **Step 4: Add animation states and reduced-motion rules**

Animate the car entering from the left, shop sign flicker, floating stars, snack bounce, and departure. Under `@media (prefers-reduced-motion: reduce)`, set transitions and animation durations to near-zero while keeping final states visible.

- [ ] **Step 5: Verify the scene at desktop and mobile widths**

Run: `python3 -m http.server 4173`
Expected: at widths around 1440px and 390px, the scene remains fully visible, buttons remain easy to tap, and no horizontal page scroll appears.

- [ ] **Step 6: Commit the visual system**

```bash
git add style.css
git commit -m "feat: add 90s pixel snack stop scene"
```

### Task 3: Implement the arrival and pause interaction state machine

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes the DOM hooks from `index.html` and visual state classes from `style.css`.
- Produces `state = { phase: 'arriving' | 'parked' | 'playing' | 'finished' | 'departing', treats: number, soundOn: boolean }`.

- [ ] **Step 1: Add a deterministic initial state and phase renderer**

Initialize with `{ phase: 'arriving', treats: 0, soundOn: false }`. Implement `renderPhase()` to set `document.body.dataset.phase`, update `#main-action` label/disabled state, and announce a short Thai status through `#live-region`.

- [ ] **Step 2: Start the arrival without requiring a click**

Listen for `animationend` on `#car`. When the arrival animation ends, transition exactly once from `arriving` to `parked`, reveal the main action, and announce `รถมาถึงร้านแล้ว แวะพักแป๊บหนึ่งไหม?`. If reduced motion is enabled, use a short `setTimeout` fallback.

- [ ] **Step 3: Make the main action start the mini-game safely**

On click and keyboard activation, transition only from `parked` to `playing`, reveal `#mini-game`, reset the treat count, and announce the game instructions. Ignore duplicate activation while the phase is not `parked`.

- [ ] **Step 4: Add an explicit restart path after departure**

After the final message, allow the same main button to reset the car and phase to `arriving`, so the link remains replayable without refreshing.

- [ ] **Step 5: Test phase transitions manually**

Use the browser and keyboard to confirm `arriving → parked → playing` and verify repeated clicks do not create duplicate timers or duplicate game objects.

- [ ] **Step 6: Commit the state machine**

```bash
git add script.js
git commit -m "feat: add mood booster scene state machine"
```

### Task 4: Add the no-pressure snack mini-game and message finale

**Files:**
- Modify: `index.html` (mini-game labels and result markup if needed)
- Modify: `style.css` (treat, heart, and result animations)
- Modify: `script.js` (mini-game logic)

**Interfaces:**
- Consumes `state.phase === 'playing'`.
- Produces `state.treats`, a completion result, and one message selected from a fixed Thai copy list.

- [ ] **Step 1: Add an accessible game board**

Give the mini-game a labelled region with a `#treat-button`, a visible `#treat-count`, and an instruction that does not imply failure. The button must be a real `<button>` and work with Enter/Space and touch.

- [ ] **Step 2: Implement five-tap treat collection with no timer or loss state**

Each valid activation increments `state.treats`, moves or bounces the treat visually, updates `#treat-count`, and announces progress. On the fifth activation, transition to `finished`, disable the treat button, reveal the result card, and start the departure animation.

- [ ] **Step 3: Add randomized positive completion copy**

Choose from exactly these initial messages: `ยิ้มได้แล้ว ค่อยไปต่อนะ`, `พักนิดเดียวก็เก่งมากแล้ว`, `ขนมหมดแล้ว แต่อารมณ์ดีเหลืออยู่นะ`, and `วันนี้ไม่ต้องโอเคทั้งหมดก็ได้`. Render the selected copy in `#message` and announce it through the live region.

- [ ] **Step 4: Verify touch, keyboard, replay, and reduced motion**

Confirm five activations work from mouse, touch, Enter, and Space; confirm no sixth activation changes the result; confirm reduced motion still reaches the result state; confirm replay returns to the arrival state.

- [ ] **Step 5: Commit the playable loop**

```bash
git add index.html style.css script.js
git commit -m "feat: add snack collecting mood game"
```

### Task 5: Add optional chiptune controls and final GitHub Pages checks

**Files:**
- Create: `assets/sounds/README.md`
- Modify: `index.html`
- Modify: `script.js`
- Modify: `style.css`

**Interfaces:**
- Produces `soundOn` state and a sound toggle that never blocks gameplay.

- [ ] **Step 1: Add a documented optional audio slot**

Create `assets/sounds/README.md` explaining that an audio file can be placed there later and that the UI must remain silent by default. Do not add a copyrighted song or remote audio dependency.

- [ ] **Step 2: Implement the sound toggle as opt-in**

Wire `#sound-toggle` to update `state.soundOn`, its `aria-pressed` value, and its label. If no local sound asset exists, the button still changes state and announces that sound is unavailable without throwing an error.

- [ ] **Step 3: Audit relative paths and static hosting behavior**

Use only relative URLs, run the site from the repository root, and verify there are no references to `/assets`, `/src`, or a local absolute path that would break under `https://<user>.github.io/imyourpixels/`.

- [ ] **Step 4: Run final verification**

Run: `python3 -m http.server 4173`
Expected: the complete loop works in a browser at `http://localhost:4173`, with no console errors, no horizontal overflow at mobile width, and working keyboard/touch activation.

- [ ] **Step 5: Commit the GitHub Pages-ready site**

```bash
git add index.html style.css script.js assets/sounds/README.md
git commit -m "feat: make pixel mood booster github pages ready"
git push
```

## Self-review

- Spec coverage: goal and experience are covered by Tasks 1, 3, and 4; visual direction by Task 2; interaction state and accessibility by Tasks 1–4; static hosting and verification by Task 5.
- Completeness scan: every implementation step names its files, behavior, verification command, and expected outcome.
- Type consistency: the phase names and state fields are defined in Task 3 and reused unchanged in Tasks 4–5.
