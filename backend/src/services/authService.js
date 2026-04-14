import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { JWT_AUDIENCE, JWT_ISSUER } from "../constants/auth.js";
import { env } from "../config/env.js";
import { ConflictError, UnauthorizedError } from "../lib/httpError.js";
import * as userRepository from "../repositories/userRepository.js";

async function hashPassword(password) {
  // OWASP currently recommends Argon2id with non-trivial memory cost for password storage.
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
  });
}

function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

export async function registerUser({ name, email, password }) {
  const existingUser = await userRepository.findAuthByEmail(email);

  if (existingUser) {
    throw new ConflictError(
      "EMAIL_ALREADY_IN_USE",
      "An account with that email already exists",
    );
  }

  const passwordHash = await hashPassword(password);

  return userRepository.createUser({
    name,
    email,
    passwordHash,
  });
}

export async function loginUser({ email, password }) {
  const user = await userRepository.findAuthByEmail(email);

  if (!user) {
    throw new UnauthorizedError(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  }

  const passwordMatches = await argon2.verify(user.passwordHash, password);

  if (!passwordMatches) {
    throw new UnauthorizedError(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  }

  return {
    token: signToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}

export async function hashProfilePassword(password) {
  return hashPassword(password);
}
