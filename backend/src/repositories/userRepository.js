import { randomUUID } from "node:crypto";

import { getDb } from "../db/database.js";
import { mapAuthUser, mapPublicUser } from "../models/userModel.js";

export async function findAuthByEmail(email) {
  const db = await getDb();
  const row = await db.get(
    `SELECT id, name, email, password_hash, created_at, updated_at
     FROM users
     WHERE email = ?`,
    email,
  );

  return mapAuthUser(row);
}

export async function findAuthById(id) {
  const db = await getDb();
  const row = await db.get(
    `SELECT id, name, email, password_hash, created_at, updated_at
     FROM users
     WHERE id = ?`,
    id,
  );

  return mapAuthUser(row);
}

export async function findPublicById(id) {
  const db = await getDb();
  const row = await db.get(
    `SELECT id, name, email, created_at, updated_at
     FROM users
     WHERE id = ?`,
    id,
  );

  return mapPublicUser(row);
}

export async function createUser({ name = null, email, passwordHash }) {
  const db = await getDb();
  const id = randomUUID();

  await db.run(
    `INSERT INTO users (id, name, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    id,
    name,
    email,
    passwordHash,
  );

  return findPublicById(id);
}

export async function updateUser(id, updates) {
  const db = await getDb();
  const currentUser = await findPublicById(id);

  if (!currentUser) {
    return null;
  }

  const assignments = [];
  const params = [];

  if (Object.prototype.hasOwnProperty.call(updates, "name")) {
    assignments.push("name = ?");
    params.push(updates.name);
  }

  if (updates.email) {
    assignments.push("email = ?");
    params.push(updates.email);
  }

  if (updates.passwordHash) {
    assignments.push("password_hash = ?");
    params.push(updates.passwordHash);
  }

  assignments.push("updated_at = CURRENT_TIMESTAMP");
  params.push(id);

  await db.run(
    `UPDATE users
     SET ${assignments.join(", ")}
     WHERE id = ?`,
    ...params,
  );

  return findPublicById(id);
}

export async function deleteUser(id) {
  const db = await getDb();
  const existingUser = await findPublicById(id);

  if (!existingUser) {
    return null;
  }

  await db.run("DELETE FROM users WHERE id = ?", id);
  return existingUser;
}
