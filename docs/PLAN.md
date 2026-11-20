# Hello World Button Page

A colorful, playful page for visitors to `hello.sheql.org`.
One centered button switches between `Click me` and `Hello World`.
The page uses plain HTML, CSS, and JavaScript and opens directly in a browser.
This prototype has one step to build and test the page; agentd publishes it after the merge.

Allowed paths: docs/PLAN.md, AGENTS.md, README.md, public/index.html, package.json, package-lock.json, .gitignore, tests/button.spec.js

## Goal

Give visitors a single button they can use by click, tap, or keyboard to switch between the two labels.

## Done when

- agentd's deploy browser check opens `https://hello.sheql.org/` and finds the text `Click me` on a fresh load.
- The first activation changes the button text to exactly `Hello World`. The second restores `Click me`, and further activations keep alternating.
- The button stays centered horizontally and vertically in both states at phone and desktop viewport sizes. Tab shows a visible focus indicator, and Enter and Space each toggle the label while focus stays on the button.
- Opening `public/index.html` directly gives the same behavior. `npm test` checks the local page by default and can run the same checks against the published page.

## Steps

### 1. Build and test the page

Create a standalone `public/index.html` with a colorful background, playful button styling, readable text, and visible keyboard focus. Use CSS Grid to center a native `<button type="button">` in the viewport. Set its initial text to `Click me` and use one click handler to alternate the button text between `Click me` and `Hello World`. Keep focus on the button during each change. If the styling uses animation, honor `prefers-reduced-motion`.

Add Playwright as a development dependency, commit the npm lockfile, and ignore generated dependency and test output directories. Add `AGENTS.md` with `npm ci` and `npx playwright install chromium` as setup commands and `npm test` as the project check. In `README.md`, explain how to open `public/index.html` directly and list the public URL `https://hello.sheql.org/`.

Add browser checks in `tests/button.spec.js`. Resolve `../public/index.html` relative to the test file with `path.resolve` and convert it with `pathToFileURL`. Accept `HELLOBUTTON_URL` to check a deployed page. Verify the single button, its initial label, repeated clicks, tap on a phone-sized viewport, visible Tab focus, and Enter and Space activation. Check centering in both states at phone and desktop sizes with a two-pixel tolerance on each axis. A failed page load or missing button must fail the test.

Run `npm test` locally. Do not publish anything: after the merge agentd copies `public/` to the Rock (`/srv/sites/hello`, served as `https://hello.sheql.org/`) and runs its own browser check.

Allowed paths: AGENTS.md, README.md, public/index.html, package.json, package-lock.json, .gitignore, tests/button.spec.js

## Out of scope

Application frameworks, backend services, saved state, analytics, new hosting infrastructure, DNS or certificate work, and production hardening.

## Risks

Low. `hello.sheql.org` is already served by the Rock's existing `*.sheql.org` wildcard (DNS, HTTPS and hosting are in place). The page must live in `public/`, the folder agentd publishes.
