# Hello World Button Page

A colorful, playful page for visitors to `hellobutton.sheql.org`.
One centered button switches between `Click me` and `Hello World`.
The page uses plain HTML, CSS, and JavaScript and opens directly in a browser.
This prototype has one step to build, test, and publish the page.

Allowed paths: docs/PLAN.md, AGENTS.md, README.md, index.html, package.json, package-lock.json, .gitignore, tests/button.spec.js

## Goal

Give visitors a single button they can use by click, tap, or keyboard to switch between the two labels.

## Done when

- The browser check opens `https://hellobutton.sheql.org/` over HTTPS, stays on that hostname, and finds exactly one button labeled `Click me` on a fresh load.
- The first activation changes the button text to exactly `Hello World`. The second restores `Click me`, and further activations keep alternating.
- The button stays centered horizontally and vertically in both states at phone and desktop viewport sizes. Tab shows a visible focus indicator, and Enter and Space each toggle the label while focus stays on the button.
- Opening `index.html` directly gives the same behavior. `npm test` checks the local page by default and can run the same checks against the published page.

## Steps

### 1. Build, test, and publish the page

Create a standalone `index.html` with a colorful background, playful button styling, readable text, and visible keyboard focus. Use CSS Grid to center a native `<button type="button">` in the viewport. Set its initial text to `Click me` and use one click handler to alternate the button text between `Click me` and `Hello World`. Keep focus on the button during each change. If the styling uses animation, honor `prefers-reduced-motion`.

Add Playwright as a development dependency, commit the npm lockfile, and ignore generated dependency and test output directories. Add `AGENTS.md` with `npm ci` and `npx playwright install chromium` as setup commands and `npm test` as the project check. In `README.md`, explain how to open `index.html` directly and list the public URL.

Add browser checks in `tests/button.spec.js`. Resolve `index.html` relative to the test file with `path.resolve` and convert it with `pathToFileURL`. Accept `HELLOBUTTON_URL` to check a deployed page. Verify the single button, its initial label, repeated clicks, tap on a phone-sized viewport, visible Tab focus, and Enter and Space activation. Check centering in both states at phone and desktop sizes with a two-pixel tolerance on each axis. A failed page load or missing button must fail the test.

Run `npm test` locally. Have agentd publish `index.html` to the existing `hello` site on the Rock 5B (`rock5b`, `hello.sheql.org`) at `/srv/sites/hello`. Before publishing, have agentd inspect the destination and preserve a restorable copy of any existing `index.html` it replaces. Leave other site files in place. After publication, run `HELLOBUTTON_URL=https://hellobutton.sheql.org/ npm test`.

Allowed paths: AGENTS.md, README.md, index.html, package.json, package-lock.json, .gitignore, tests/button.spec.js

## Out of scope

Application frameworks, backend services, saved state, analytics, new hosting infrastructure, and production hardening.

## Risks

David confirmed that `hellobutton.sheql.org` already points to the `hello` site. The public browser check verifies that the hostname serves the expected page over HTTPS. If DNS, TLS, or routing fails, give agentd the failing URL and error. Record any DNS, certificate, or routing fix agentd makes in `README.md`, then rerun the public check before marking publication complete.
