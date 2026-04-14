import { BadRequestError } from "../lib/httpError.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    const parsedBody = schema.safeParse(req.body ?? {});

    if (!parsedBody.success) {
      return next(
        new BadRequestError("Request validation failed", parsedBody.error.flatten()),
      );
    }

    req.body = parsedBody.data;
    return next();
  };
}
