import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

const envPath = resolve(__dirname, ".env");
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}
export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  retries: process.env.CI ? 2 : 1,

  workers: 1,

  reporter: "html",

  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
