import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? join(__dirname, "..", "..", "data");
mkdirSync(dataDir, { recursive: true });

export const db = new Database(join(dataDir, "app.db"));
db.pragma("journal_mode = WAL");

export function ensureTable(tableName: string): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
}
