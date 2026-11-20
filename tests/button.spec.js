const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

const localUrl = pathToFileURL(path.resolve(__dirname, '../public/index.html')).href;
const pageUrl = process.env.HELLOBUTTON_URL || localUrl;

test.use({ viewport: { width: 1280, height: 800 } });

async function loadButton(page) {
  const response = await page.goto(pageUrl);
  expect(response?.ok(), `Page did not load successfully at ${pageUrl}`).toBe(true);

  const button = page.getByRole('button', { includeHidden: true });
  await expect(button).toHaveCount(1);
  await expect(button).toHaveJSProperty('textContent', 'Click me');
  return button;
}

async function expectCentered(button) {
  const { horizontal, vertical } = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return {
      horizontal: Math.abs(bounds.left + bounds.width / 2 - window.innerWidth / 2),
      vertical: Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2),
    };
  });

  expect(horizontal, 'Horizontal distance from viewport center').toBeLessThanOrEqual(2);
  expect(vertical, 'Vertical distance from viewport center').toBeLessThanOrEqual(2);
}

function getOutline(button) {
  return button.evaluate(element => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
}

test('clicks alternate labels and keep the button centered on desktop', async ({ page }) => {
  const button = await loadButton(page);
  await expectCentered(button);

  for (const label of ['Hello World', 'Click me', 'Hello World', 'Click me']) {
    await button.click();
    await expect(button).toHaveJSProperty('textContent', label);
    await expectCentered(button);
  }
});

test('Tab shows focus and Enter and Space toggle without moving focus', async ({ page }) => {
  const button = await loadButton(page);
  const initialOutline = await getOutline(button);

  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  const focusedOutline = await getOutline(button);
  expect(focusedOutline).not.toEqual(initialOutline);
  expect(focusedOutline.style).not.toBe('none');
  expect(focusedOutline.width).toBeGreaterThan(0);

  await page.keyboard.press('Enter');
  await expect(button).toHaveJSProperty('textContent', 'Hello World');
  await expect(button).toBeFocused();

  await page.keyboard.press('Space');
  await expect(button).toHaveJSProperty('textContent', 'Click me');
  await expect(button).toBeFocused();
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('taps alternate labels and keep the button centered', async ({ page }) => {
    const button = await loadButton(page);
    await expectCentered(button);

    for (const label of ['Hello World', 'Click me']) {
      await button.tap();
      await expect(button).toHaveJSProperty('textContent', label);
      await expectCentered(button);
    }
  });
});
