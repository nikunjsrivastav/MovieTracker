import { Router } from "express";

import {
  deleteCurrentUserProfile,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { updateCurrentUserSchema } from "../validators/userValidators.js";

export const userRouter = Router();

// All profile routes operate on the authenticated user, so ownership is enforced by design.
userRouter.use(authenticate);
userRouter.get("/me", getCurrentUserProfile);
userRouter.patch("/me", validateBody(updateCurrentUserSchema), updateCurrentUserProfile);
userRouter.delete("/me", deleteCurrentUserProfile);
