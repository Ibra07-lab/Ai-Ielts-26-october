import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'ibragimkovalenko@gmail.com';
const TEST_PASSWORD = 'Ibragim01';

test.describe('Onboarding Flow', () => {
  test('should complete the onboarding questionnaire and generate a study plan', async ({ page }) => {
    // Log browser errors for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`BROWSER ERROR: ${msg.text()}`);
      }
    });

    // ─── Step 0: Log in via the actual Login page ───
    await page.goto('/login');
    await expect(page.locator('text=Welcome Back')).toBeVisible({ timeout: 10000 });

    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Wait for login to complete
    await page.waitForURL(/.*\/(dashboard|onboarding)/, { timeout: 15000 });
    console.log('Post-login URL:', page.url());

    // ─── Step 0b: Reset onboardingCompleted flag ───
    if (page.url().includes('/dashboard')) {
      await page.evaluate(async () => {
        // @ts-ignore — dynamic ESM import runs in browser context via Playwright
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabase = createClient(
          'https://hybpdeunlpxmfwcthrfy.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YnBkZXVubHB4bWZ3Y3RocmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDI0NDgsImV4cCI6MjA4ODIxODQ0OH0.gc_oqHgugoPKu_54RmSPc9rEHbVrTL9yjcOb9chsfZ0'
        );
        await supabase.auth.updateUser({ data: { onboardingCompleted: false } });
      });
      await page.reload();
      await page.waitForURL(/.*\/onboarding/, { timeout: 15000 });
    }

    // ─── Now on /onboarding ───
    console.log('Onboarding URL:', page.url());
    await expect(page).toHaveURL(/.*\/onboarding/);

    // ═══ Q1: Target Score ═══
    await expect(page.locator('text=What overall IELTS band score do you need?')).toBeVisible({ timeout: 10000 });
    await page.locator('button', { hasText: '7.0' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q2: Test Date ═══
    await expect(page.locator('text=When is your IELTS test?')).toBeVisible();
    await page.locator('button', { hasText: 'Within 2 months' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q3: Previous Experience ═══
    await expect(page.locator('text=Have you taken IELTS before?')).toBeVisible();
    await page.locator('button', { hasText: 'Yes, I have my scores' }).click();
    // Band selectors appear inline — accept defaults and continue
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q5: Section Minimums ═══
    await expect(page.locator('text=Do you need a minimum score in each section?')).toBeVisible();
    await page.locator('button', { hasText: 'No, I only need an overall band' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q6: Weakest Skill ═══
    await expect(page.locator('text=Which skill do you find hardest?')).toBeVisible();
    await page.locator('button', { hasText: 'Writing' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q7: Specific Challenges ═══
    await expect(page.locator('text=biggest challenge with Writing')).toBeVisible();
    await page.locator('button', { hasText: 'My vocabulary is limited' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q8: Daily Study Time ═══
    await expect(page.locator('text=How much time can you study per day?')).toBeVisible();
    await page.locator('button', { hasText: '60 minutes' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Q9: Days Per Week ═══
    await expect(page.locator('text=How many days per week can you study?')).toBeVisible();
    await page.locator('button', { hasText: '5 days' }).click();
    await page.locator('button', { hasText: 'Continue' }).click();

    // ═══ Summary Page ═══
    await expect(page.locator('text=Your Study Profile')).toBeVisible();
    await page.locator('button', { hasText: 'Build My Plan' }).click();

    // ═══ Assert: Redirected to /plan ═══
    await expect(page).toHaveURL(/.*\/plan/, { timeout: 60000 });
    console.log('Final URL:', page.url());
  });

  // Cleanup: restore onboardingCompleted to true
  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*\/(dashboard|onboarding|plan)/, { timeout: 15000 });

    await page.evaluate(async () => {
      // @ts-ignore — dynamic ESM import runs in browser context via Playwright
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(
        'https://hybpdeunlpxmfwcthrfy.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YnBkZXVubHB4bWZ3Y3RocmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDI0NDgsImV4cCI6MjA4ODIxODQ0OH0.gc_oqHgugoPKu_54RmSPc9rEHbVrTL9yjcOb9chsfZ0'
      );
      await supabase.auth.updateUser({ data: { onboardingCompleted: true } });
    });
    await page.close();
  });
});
