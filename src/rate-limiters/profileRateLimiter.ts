import rateLimit from "express-rate-limit";

export const profileRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,

  limit: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests.",
  },
});