/**
 * SDK smoke test — verifies the SDK can talk to a running Sentinel backend.
 *
 * Prerequisites:
 *   1. Backend running on http://localhost:5000
 *   2. A registered developer (grab your API key from the dashboard)
 *   3. An application created in the dashboard (e.g. "test-app")
 *
 * Usage:
 *   cd sdk
 *   node test.js
 *
 * Edit the API_KEY and APP_NAME below before running.
 */

import sentinel from "./index.js";

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  EDIT THESE before running (or set SENTINEL_API_KEY / SENTINEL_APP_NAME)   ║
// ╚════════════════════════════════════════════════════════════════════════════╝
const API_KEY = process.env.SENTINEL_API_KEY || "PASTE_YOUR_API_KEY_HERE";
const APP_NAME = process.env.SENTINEL_APP_NAME || "test-app";

// ─── Run ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY || API_KEY === "PASTE_YOUR_API_KEY_HERE") {
    throw new Error(
      "API key not set! Please edit sdk/test.js to paste your API key, or run with 'SENTINEL_API_KEY=your_key node test.js'.",
    );
  }
  if (!APP_NAME) {
    throw new Error("Application name is required to run the smoke test.");
  }

  console.log("🔧 Initialising Sentinel SDK…");
  sentinel.init({ apiKey: API_KEY, appName: APP_NAME });

  console.log("\n📤 Sending INFO log…");
  const r1 = await sentinel.info("Server started successfully");
  console.log("   ✅", r1.message, "→ count:", r1.log.count);

  console.log("\n📤 Sending WARN log…");
  const r2 = await sentinel.warn("Memory usage above 80%");
  console.log("   ✅", r2.message, "→ count:", r2.log.count);

  console.log("\n📤 Sending ERROR log…");
  const r3 = await sentinel.error("Unhandled promise rejection");
  console.log("   ✅", r3.message, "→ count:", r3.log.count);

  console.log("\n📤 Sending duplicate INFO (count should increment)…");
  const r4 = await sentinel.info("Server started successfully");
  console.log("   ✅", r4.message, "→ count:", r4.log.count, "(should be ≥ 2)");

  console.log(
    "\n🎉 All logs sent! Check your dashboard at http://localhost:5173",
  );
}

main().catch((err) => {
  console.error("\n❌ Test failed:", err.message);
  process.exit(1);
});
