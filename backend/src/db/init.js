import { closeDb, getDb } from "./database.js";

await getDb();
console.log("SQLite database initialized.");
await closeDb();
