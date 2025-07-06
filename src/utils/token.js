import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";

// ✅ Generate Access and Refresh Tokens
export const generateTokens = async (user) => {
    try {
        const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role, app: user.app }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
        });

        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10),
        });

        // 🔐 Save to Redis (key: refresh:<userId>, value: refreshToken)
        await redisClient.set(`refresh:${user.id}`, refreshToken, { EX: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token üretim hatası:", error.message);
        throw new Error("Token üretilemedi");
    }
};

// ✅ Refresh Access Token validation
export const verifyRefreshToken = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // 📦 Checking token with Redis
        const storedToken = await redisClient.get(`refresh:${payload.userId}`);

        if (storedToken !== token) {
            console.warn("Refresh token geçersiz veya önceki bir token");
            return null;
        }

        return payload;
    } catch (err) {
        console.error("Refresh token doğrulama hatası:", err.message);
        return null;
    }
};
