import { test } from "node:test";
import assert from "node:assert/strict";
import { detectItemCategoryIntent, detectProvider, isLiveSalesQuestion } from "./liveSalesIntent.js";

// ---- Part 11, test F: Ask Anything source selection (pure routing logic, no DB) ----

test("a live-sales question (no dataset keyword) is routed to provider_orders", () => {
  assert.equal(isLiveSalesQuestion("What were today's sales?", {}), true);
  assert.equal(isLiveSalesQuestion("How many orders did we get yesterday?", {}), true);
  assert.equal(isLiveSalesQuestion("What's our average order value this week?", {}), true);
  assert.equal(isLiveSalesQuestion("How much did Kiosk sell today?", {}), true);
  assert.equal(isLiveSalesQuestion("How much did Petpooja sell today?", {}), true);
  assert.equal(isLiveSalesQuestion("What's the combined sales for September 20?", {}), true);
});

test("a purely imported-operational question (production/wastage) is NOT routed to provider_orders", () => {
  assert.equal(isLiveSalesQuestion("How much did we waste last week?", { datasetTypes: ["wastage"] }), false);
  assert.equal(isLiveSalesQuestion("What was our production yesterday?", { datasetTypes: ["production"] }), false);
});

test("a mixed question (mentions both a sales word and an operational dataset) is still recognized as live-sales-applicable", () => {
  // "sales" keyword present -> live sales applies; groundedAnswer.ts also
  // detects the "wastage" dataset type separately and adds the dataset_records
  // side, so both sources get represented (Part 1, Rule D).
  assert.equal(isLiveSalesQuestion("Compare today's sales to last week's wastage", { datasetTypes: ["wastage"] }), true);
});

test("an explicit 'sales' dataset-type slot (from the existing classifier) is honored even without a matching keyword in the text", () => {
  assert.equal(isLiveSalesQuestion("How are we doing?", { datasetTypes: ["sales"] }), true);
});

test("detectProvider recognizes Petpooja and Kiosk/GoSelfServe by name, and returns undefined (combined) when neither or both are named", () => {
  assert.equal(detectProvider("How much did Petpooja sell today?"), "petpooja");
  assert.equal(detectProvider("How much did Kiosk sell today?"), "goselfserve");
  assert.equal(detectProvider("How much did GoSelfServe sell today?"), "goselfserve");
  assert.equal(detectProvider("What were today's total sales?"), undefined);
  assert.equal(detectProvider("Compare Petpooja and Kiosk sales today"), undefined);
});

test("detectItemCategoryIntent recognizes item and category questions independently", () => {
  assert.deepEqual(detectItemCategoryIntent("What were our top selling items today?"), { wantsItems: true, wantsCategories: false });
  assert.deepEqual(detectItemCategoryIntent("Which category made the most revenue?"), { wantsItems: false, wantsCategories: true });
  assert.deepEqual(detectItemCategoryIntent("What were today's total sales?"), { wantsItems: false, wantsCategories: false });
});
