import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePetpoojaPayload } from "./petpooja.js";

// Fixtures below mirror the real shape of production `provider_webhook_events`
// rows for RestID pomj6bse (2026-09-15 incident) -- orderID, order_type,
// totals, and item names are taken from real payloads; customer name/phone
// (blank in the real rows anyway) are placeholders, never real PII.
function petpoojaPayload(overrides: { orderID: number; order_type: string; sub_order_type?: string }) {
  return {
    token: "",
    event: "orderdetails",
    properties: {
      Restaurant: {
        res_name: "The Rameshwaram Cafe - Whitefield",
        address: "#1 Green Avenue, ITPL Road, Bangalore\r\nPIN: 560037",
        contact_information: "9008691113,9902587300",
        restID: "pomj6bse",
      },
      Customer: { name: "", address: "", phone: "", gstin: "" },
      Order: {
        orderID: overrides.orderID,
        customer_invoice_id: `RC/00${overrides.orderID}`,
        delivery_charges: 0,
        order_type: overrides.order_type,
        payment_type: "Other",
        table_no: "",
        no_of_persons: 1,
        discount_total: 0,
        tax_total: 5,
        round_off: "0",
        core_total: 100,
        total: 105,
        created_on: "2026-09-15 20:00:53",
        order_from: "POS",
        order_from_id: "",
        sub_order_type: overrides.sub_order_type ?? overrides.order_type,
        packaging_charge: 0,
        status: "Success",
        token_no: "555",
        comment: "",
        service_charge: 0,
        biller: "Prakasha (Prakasha)",
        assignee: "",
      },
      Tax: [
        { title: "CGST", type: "P", rate: 2.5, amount: 2.5 },
        { title: "SGST", type: "P", rate: 2.5, amount: 2.5 },
      ],
      Discount: [],
      OrderItem: [
        {
          name: "Ghee Pudi Idli",
          itemid: 122133024,
          itemcode: "6",
          specialnotes: "",
          price: 100,
          quantity: 1,
          total: 100,
          addon: [],
          category_name: "Ghee Pudi Idli",
          discount: 0,
          tax: 5,
        },
      ],
    },
  };
}

test("Dine In -> dine_in (real order 279 shape, restID 460212 sandbox demo)", () => {
  const payload = petpoojaPayload({ orderID: 279, order_type: "Dine In", sub_order_type: "AC" });
  payload.properties.Restaurant.restID = "460212";
  const normalized = normalizePetpoojaPayload(payload);
  assert.equal(normalized.orderType, "dine_in");
  assert.equal(normalized.providerOrderId, "279");
});

test('Pickup (no space, real order 244713) -> pick_up', () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244713, order_type: "Pickup" }));
  assert.equal(normalized.orderType, "pick_up");
  assert.equal(normalized.restaurantId, "pomj6bse");
});

test('"Pick up" (documented sample spelling) -> pick_up', () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244720, order_type: "Pick up" }));
  assert.equal(normalized.orderType, "pick_up");
});

test('"Pick Up" (title case) -> pick_up', () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244721, order_type: "Pick Up" }));
  assert.equal(normalized.orderType, "pick_up");
});

test('"PICKUP" (all caps, no space) -> pick_up', () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244723, order_type: "PICKUP" }));
  assert.equal(normalized.orderType, "pick_up");
});

test('"  Pick   Up  " (stray/collapsed whitespace) -> pick_up', () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244724, order_type: "  Pick   Up  " }));
  assert.equal(normalized.orderType, "pick_up");
});

test("Delivery -> delivery", () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 244722, order_type: "Delivery" }));
  assert.equal(normalized.orderType, "delivery");
});

test('Self service (real order 244715) -> other, does not throw', () => {
  const normalized = normalizePetpoojaPayload(
    petpoojaPayload({ orderID: 244715, order_type: "Self service", sub_order_type: "Self service" })
  );
  assert.equal(normalized.orderType, "other");
  assert.equal(normalized.providerOrderId, "244715");
});

test("unrecognized future order_type -> other, webhook does not crash", () => {
  const normalized = normalizePetpoojaPayload(petpoojaPayload({ orderID: 999999, order_type: "Kiosk Order" }));
  assert.equal(normalized.orderType, "other");
});

test('unknown value containing "pick"/"dine"/"deliver" is NOT keyword-matched -> other', () => {
  // Proves mapOrderType uses an explicit lookup, not substring matching --
  // "Self Pickup Counter" must not silently become pick_up just because it
  // contains "pick"; it's not a value Petpooja is confirmed to send.
  const selfPickup = normalizePetpoojaPayload(petpoojaPayload({ orderID: 999998, order_type: "Self Pickup Counter" }));
  assert.equal(selfPickup.orderType, "other");

  const diningRoom = normalizePetpoojaPayload(petpoojaPayload({ orderID: 999997, order_type: "Dining Room Reserved" }));
  assert.equal(diningRoom.orderType, "other");

  const deliveryDrone = normalizePetpoojaPayload(petpoojaPayload({ orderID: 999996, order_type: "Deliveroo Partner" }));
  assert.equal(deliveryDrone.orderType, "other");
});

test("normalizePetpoojaPayload still rejects a structurally invalid payload", () => {
  assert.throws(() => normalizePetpoojaPayload({ event: "orderdetails", properties: {} }), /Missing properties\.Order object/);
});
