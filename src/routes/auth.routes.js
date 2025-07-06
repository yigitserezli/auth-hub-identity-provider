import express from "express";
import { login, registerUser } from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../controllers/refreshToken.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { authRateLimiter, generalRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login", authRateLimiter, login);
router.post("/register", authRateLimiter, registerUser);
router.post("/refresh-token", generalRateLimiter, refreshAccessToken);
router.post("/logout", generalRateLimiter, logout);

export default router;
