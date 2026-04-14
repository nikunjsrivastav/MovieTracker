import { z } from "zod";

import { emailSchema, nameSchema, passwordSchema } from "./authValidators.js";

export const updateCurrentUserSchema = z
  .strictObject({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    currentPassword: z.string().min(1, "Current password is required").max(128).optional(),
    password: passwordSchema.optional(),
  })
  .refine(
    (value) => !value.password || value.currentPassword,
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  )
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });
