import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeDb, getDb } from "./db/database.js";

await getDb();

const server = app.listen(env.PORT, () => {
  console.log(`MovieTracker API listening on http://localhost:${env.PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await closeDb();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
