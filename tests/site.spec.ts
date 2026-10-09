import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('responsive layouts, images and metadata', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    for (const id of ['univers', 'activites', 'galerie', 'inscription', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await page.evaluate(async () => { await Promise.all(Array.from(document.images).filter(img => img.getBoundingClientRect().width > 0).map(img => img.decode())); });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `test-results/site-${width}.png`, fullPage: true });
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/hero-${width}.png` });
  }
  await expect(page).toHaveTitle("Magic Land | Jardin d'Enfants à Cité La Gazelle");
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  expect(errors).toEqual([]);
});

test('page and modal pass automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(report.violations).toEqual([]);
  await page.getByRole('button', { name: /^Agrandir la photo 1/ }).click();
  const modalReport = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(modalReport.violations).toEqual([]);
});

test('mobile menu opens, navigates and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Nos activités' }).click();
  await expect(page).toHaveURL(/#activites$/);
  await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toBeFocused();
});

test('lightbox cycles with arrows, traps focus and restores it', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: /^Agrandir la photo 1/ });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('figcaption')).toContainText('1 / 6');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption')).toContainText('2 / 6');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('figcaption')).toContainText('1 / 6');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('figcaption')).toContainText('6 / 6');
  for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBeTruthy(); }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('form validates and never claims an unconfigured message was delivered', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Vérifier ma demande' }).click();
  await expect(page.getByLabel('Nom du parent')).toBeFocused();
  await expect(page.locator('.field-error')).toHaveCount(4);
  await page.getByLabel('Nom du parent').fill('Parent Test');
  await page.getByLabel('Téléphone', { exact: false }).fill('25 123 456');
  await page.getByLabel('Adresse e-mail').fill('parent@example.com');
  await page.getByLabel('Votre message').fill('Bonjour, je souhaite connaître les modalités d’inscription.');
  await page.getByRole('button', { name: 'Vérifier ma demande' }).click();
  await expect(page.getByRole('status')).toContainText('elle n’a pas été envoyée');
  const invalid = await request.post('/api/contact', { data: {} });
  expect(invalid.status()).toBe(400);
  const valid = await request.post('/api/contact', { data: { name: 'Parent Test', phone: '25123456', email: 'parent@example.com', message: 'Une demande valide pour tester le formulaire.' } });
  expect(valid.status()).toBe(503);
  await expect(page.locator('a[href="tel:+21625482108"]').first()).toBeAttached();
  await expect(page.locator('a[href="tel:+21653860323"]').first()).toBeAttached();
});

test('smooth scrolling, text reveal and gallery work with motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.evaluate(() => document.fonts.ready);
  const titleWords = page.locator('h1 .reveal-word');
  await expect(titleWords.first()).toHaveCSS('opacity', '1');
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(450);
  await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Nos activités' }).click();
  await expect(page).toHaveURL(/#activites$/);
  await expect.poll(() => page.locator('#activites').evaluate(el => Math.abs(el.getBoundingClientRect().top - 145))).toBeLessThan(5);
  await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Galerie' }).click();
  await expect.poll(() => page.locator('#galerie').evaluate(el => Math.abs(el.getBoundingClientRect().top - 145))).toBeLessThan(5);
  await expect(page.locator('#galerie h2 .reveal-word').last()).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: /^Agrandir la photo 1/ }).click();
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
});

test('photo frames preserve complete source aspect ratios', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const photos = await page.locator('.photo img').evaluateAll(images => images.map(image => {
      const img = image as HTMLImageElement;
      return { actual: img.clientWidth / img.clientHeight, expected: Number(img.getAttribute('width')) / Number(img.getAttribute('height')), fit: getComputedStyle(img).objectFit };
    }));
    for (const photo of photos) { expect(photo.fit).toBe('contain'); expect(Math.abs(photo.actual - photo.expected)).toBeLessThan(0.035); }
    await expect(page.locator('.gallery-item button')).toHaveCount(6);
    for (const button of await page.locator('.gallery-item button').all()) await expect(button).toBeVisible();
  }
});

test('mobile anchor scrolling lands below the header with animation enabled', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Nos activités' }).click();
  await expect(page).toHaveURL(/#activites$/);
  await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toHaveCount(0);
  await expect.poll(() => page.locator('#activites').evaluate(el => Math.abs(el.getBoundingClientRect().top - 125))).toBeLessThan(5);
  await expect(page.locator('#activites')).toBeFocused();
});
