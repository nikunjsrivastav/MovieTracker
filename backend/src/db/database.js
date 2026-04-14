import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { env } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "schema.sql");

let databasePromise;

async function createDatabase() {
  const databasePath = path.resolve(process.cwd(), env.DATABASE_URL);

  await mkdir(path.dirname(databasePath), { recursive: true });

  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });

  const schema = await readFile(schemaPath, "utf8");
  await db.exec(schema);
  await ensureSchema(db);

  return db;
}

async function ensureSchema(db) {
  const columns = await db.all("PRAGMA table_info(users)");
  const hasNameColumn = columns.some((column) => column.name === "name");

  if (!hasNameColumn) {
    await db.exec("ALTER TABLE users ADD COLUMN name TEXT");
  }
}

export function getDb() {
  if (!databasePromise) {
    databasePromise = createDatabase();
  }

  return databasePromise;
}

export async function closeDb() {
  if (!databasePromise) {
    return;
  }

  const db = await databasePromise;
  databasePromise = undefined;
  await db.close();
}
