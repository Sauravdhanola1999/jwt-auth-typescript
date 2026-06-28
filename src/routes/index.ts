import { Router } from "express";
import controller from "../controllers/index.js";
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

router.post("/register", authRateLimiter, validateRequest(registerSchema), controller.register);
router.post("/login", authRateLimiter, validateRequest(loginSchema), controller.login);
router.post(
  "/logout",
  authenticate,
  validateRequest(tokenSchema),
  controller.logout
);
router.post("/refresh", authRateLimiter, validateRequest(tokenSchema), controller.refresh);
router.post("/logout-all", authenticate, controller.logoutAll);
router.get("/profile",  profileRateLimiter, authenticate, controller.profile);


export default router;