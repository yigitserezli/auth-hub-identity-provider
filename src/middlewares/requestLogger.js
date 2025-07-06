// src/middleware/requestLogger.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const requestLogger = async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "unknown";
    const method = req.method;
    const url = req.originalUrl;
    let userId = null;

    // ✅ JWT decoding
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            console.warn("Log JWT parse edilemedi:", err.message);
        }
    }

    // 🕒 Logging after response
    res.on("finish", async () => {
        try {
            await prisma.requestLog.create({
                data: {
                    ip,
                    userAgent,
                    method,
                    url,
                    status: res.statusCode,
                    userId,
                    meta: JSON.stringify({
                        email: req.body?.email,
                        role: req.body?.role,
                        app: req.body?.app,
                    }),
                },
            });
        } catch (err) {
            console.error("Log couldn't inject to database:", err.message);
        }
    });

    next();
};
