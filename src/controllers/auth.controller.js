import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateTokens } from "../utils/token.js";

const prisma = new PrismaClient();

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Wrong password." });

        const tokens = await generateTokens(user);

        res.status(200).json({ user: { id: user.id, email: user.email, role: user.role, app: user.app }, ...tokens });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const registerUser = async (req, res) => {
    const { email, password, role = "user", app = "default-app" } = req.body;

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                app,
            },
        });

        return res.status(201).json({
            message: "User registered",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                app: user.app,
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(400).json({ message: "Refresh token need." });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        await redisClient.del(`refresh:${decoded.userId}`);
        return res.status(200).json({ message: "Logout" });
    } catch (error) {
        console.error("Logout hatası:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
};
