import rateLimit from "express-rate-limit";


export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    message: "Too many login attempts. Try again after 10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});