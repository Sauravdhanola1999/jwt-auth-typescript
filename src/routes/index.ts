import { Router } from "express";
import { authController } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
  tokenSchema,
} from "../middleware/validation.js";
import { authRateLimiter } from "../rate-limiters/authRateLimiter.js";
import { profileRateLimiter } from "../rate-limiters/profileRateLimiter.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateRequest(registerSchema),
  authController.register
);
router.post(
  "/login",
  authRateLimiter,
  validateRequest(loginSchema),
  authController.login
);
router.post(
  "/logout",
  authenticate,
  validateRequest(tokenSchema),
  authController.logout
);
router.post(
  "/refresh",
  authRateLimiter,
  validateRequest(tokenSchema),
  authController.refresh
);
router.post("/logout-all", authenticate, authController.logoutAll);
router.get("/profile", profileRateLimiter, authenticate, authController.profile);
router.get("/profiles", authenticate, authController.profiles);

export default router;