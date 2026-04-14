import jwt from "jsonwebtoken";

import { JWT_AUDIENCE, JWT_ISSUER } from "../constants/auth.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../lib/httpError.js";
import * as userRepository from "../repositories/userRepository.js";

export async function authenticate(req, _res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedError("AUTH_TOKEN_MISSING", "Authorization token is missing");
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("AUTH_TOKEN_INVALID", "Bearer token is required");
    }

    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (typeof payload !== "object" || !payload.sub) {
      throw new UnauthorizedError("AUTH_TOKEN_INVALID", "Token payload is invalid");
    }

    const user = await userRepository.findPublicById(payload.sub);

    if (!user) {
      throw new UnauthorizedError(
        "AUTH_TOKEN_INVALID",
        "The user for this token no longer exists",
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("AUTH_TOKEN_INVALID", "Token is invalid or expired"));
    }

    return next(error);
  }
}
