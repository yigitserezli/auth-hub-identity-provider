import { verifyRefreshToken, generateTokens } from "../utils/token.js";
import prisma from "../db/prismaClient.js";

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token missing" });
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const { userId } = decoded;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const tokens = await generateTokens(user);

    return res.json({
        message: "Access token refreshed",
        ...tokens,
    });
};
