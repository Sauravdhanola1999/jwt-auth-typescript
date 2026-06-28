import { Router } from "express";
import controller from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
  tokenSchema,
} from "../middleware/validation.js";
import { checkRole } from "../middleware/authorize.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), controller.register);
router.post("/login", validateRequest(loginSchema), controller.login);
router.post(
  "/logout",
  authenticate,
  validateRequest(tokenSchema),
  controller.logout
);
router.post("/refresh", validateRequest(tokenSchema), controller.refresh);
router.post("/logout-all", authenticate, controller.logoutAll);
router.get("/profile", authenticate, controller.profile);

// Admin dashboard route to verify role authorization
router.get(
  "/admin/dashboard",
  authenticate,
  checkRole(["admin"]),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Admin Dashboard",
    });
  }
);

export default router;