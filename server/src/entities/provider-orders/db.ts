import { db } from "../../db/client.js";

export function ensureProviderOrderTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS provider_orders (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      providerOrderId TEXT NOT NULL,
      providerInvoiceId TEXT NOT NULL,
      restaurantId TEXT NOT NULL,
      restaurantName TEXT NOT NULL,
      status TEXT NOT NULL,
      orderType TEXT NOT NULL,
      orderFrom TEXT NOT NULL,
      orderFromLabel TEXT NOT NULL,
      subOrderType TEXT NOT NULL,
      paymentType TEXT NOT NULL,
      tableNo TEXT NOT NULL,
      noOfPersons INTEGER NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      coreTotal REAL NOT NULL,
      taxTotal REAL NOT NULL,
      discountTotal REAL NOT NULL,
      packagingCharge REAL NOT NULL,
      serviceCharge REAL NOT NULL,
      deliveryCharges REAL NOT NULL,
      roundOff REAL NOT NULL,
      totalAmount REAL NOT NULL,
      comment TEXT NOT NULL,
      biller TEXT NOT NULL,
      assignee TEXT NOT NULL,
      tokenNo TEXT NOT NULL,
      itemCount INTEGER NOT NULL,
      itemsJson TEXT NOT NULL,
      taxesJson TEXT NOT NULL,
      discountsJson TEXT NOT NULL,
      partPaymentsJson TEXT NOT NULL,
      rawPayloadJson TEXT NOT NULL,
      providerCreatedAt TEXT NOT NULL,
      receivedAt TEXT NOT NULL,
      goselfserveSyncStatus TEXT NOT NULL DEFAULT 'pending',
      goselfserveSyncError TEXT,
      goselfserveSyncedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      UNIQUE(provider, providerOrderId)
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_provider_orders_status ON provider_orders(status)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_provider_orders_received_at ON provider_orders(receivedAt)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_provider_orders_provider ON provider_orders(provider)`);

  // Audit trail of every inbound webhook call, independent of whether it parsed
  // into a provider_orders row -- lets us see rejected/duplicate/error deliveries
  // without needing the provider to resend anything.
  db.exec(`
    CREATE TABLE IF NOT EXISTS provider_webhook_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      receivedAt TEXT NOT NULL,
      ok INTEGER NOT NULL,
      httpStatus INTEGER NOT NULL,
      providerOrderId TEXT,
      duplicate INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      bodyJson TEXT NOT NULL
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_provider_webhook_events_received_at ON provider_webhook_events(receivedAt)`);
}
