import { expect, test } from "@playwright/test";

test.describe("Settings flows", () => {
  test("the home page loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});
