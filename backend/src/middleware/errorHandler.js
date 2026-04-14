import { env } from "../config/env.js";
import { ConflictError, HttpError, NotFoundError } from "../lib/httpError.js";

export function notFoundHandler(_req, _res, next) {
  next(new NotFoundError("Route not found"));
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === "SQLITE_CONSTRAINT_UNIQUE" || error?.code === "SQLITE_CONSTRAINT") {
    error = new ConflictError("RESOURCE_CONFLICT", "A unique constraint was violated");
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message || "Something went wrong",
    },
  });
}
