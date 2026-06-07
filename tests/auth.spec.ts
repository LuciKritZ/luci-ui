import { expect, test } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('unauthenticated users are redirected from /manage to login', async ({
    page,
  }) => {
    await page.goto('/manage');

    // Depending on the app's redirect behavior, it either goes to / or /auth/login
    // It seems to redirect to /login
    await expect(page).toHaveURL('/login');
  });
});
