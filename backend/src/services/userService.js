import { ConflictError, NotFoundError } from "../lib/httpError.js";
import * as userRepository from "../repositories/userRepository.js";
import { hashProfilePassword } from "./authService.js";
import argon2 from "argon2";

export async function updateCurrentUser(userId, updates) {
  const nextValues = {};

  if (Object.prototype.hasOwnProperty.call(updates, "name")) {
    nextValues.name = updates.name;
  }

  if (updates.email) {
    const existingUser = await userRepository.findAuthByEmail(updates.email);

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError(
        "EMAIL_ALREADY_IN_USE",
        "An account with that email already exists",
      );
    }

    nextValues.email = updates.email;
  }

  if (updates.password) {
    const authUser = await userRepository.findAuthById(userId);

    if (!authUser) {
      throw new NotFoundError("User not found");
    }

    const passwordMatches = await argon2.verify(
      authUser.passwordHash,
      updates.currentPassword,
    );

    if (!passwordMatches) {
      throw new ConflictError(
        "CURRENT_PASSWORD_INCORRECT",
        "Current password is incorrect",
      );
    }

    nextValues.passwordHash = await hashProfilePassword(updates.password);
  }

  const updatedUser = await userRepository.updateUser(userId, nextValues);

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return updatedUser;
}

export async function deleteCurrentUser(userId) {
  const deletedUser = await userRepository.deleteUser(userId);

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return deletedUser;
}

export async function requireCurrentUser(userId) {
  const user = await userRepository.findPublicById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
