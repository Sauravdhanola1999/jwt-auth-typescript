import rateLimit from "express-rate-limit";

export const globalRateLimitar = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,

  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
