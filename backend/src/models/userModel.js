function toIsoString(value) {
  return new Date(value.replace(" ", "T") + "Z").toISOString();
}

export function mapPublicUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name ?? null,
    email: row.email,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export function mapAuthUser(row) {
  if (!row) {
    return null;
  }

  return {
    ...mapPublicUser(row),
    passwordHash: row.password_hash,
  };
}
