import { rateLimit } from "express-rate-limit";

const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export default rateLimitConfig;
