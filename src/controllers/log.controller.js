import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export const getAllLogs = async (req, res) => {
    try {
        const logs = await prisma.requestLog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "All logs couldn't fetch." });
    }
};

export const getLatestLogs = async (req, res) => {
    try {
        const logs = await prisma.requestLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Last 100 logs couldn't fetch." });
    }
};

export const getLogsByDateRange = async (range, res) => {
    try {
        let startDate;

        const now = dayjs();
        switch (range) {
            case "today":
                startDate = now.startOf("day");
                break;
            case "yesterday":
                startDate = now.subtract(1, "day").startOf("day");
                break;
            default:
                const days = parseInt(range);
                if (!isNaN(days)) {
                    startDate = now.subtract(days, "day");
                } else {
                    return res.status(400).json({ message: "Invalid date range." });
                }
        }

        const logs = await prisma.requestLog.findMany({
            where: {
                createdAt: {
                    gte: startDate.toDate(),
                },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Logs couldn't fetch according to date" });
    }
};

export const queryLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, method, status, url, ip, userAgent, export: exportType } = req.query;

        const filters = {};
        if (method) filters.method = method;
        if (status) filters.status = parseInt(status);
        if (url) filters.url = { contains: url };
        if (ip) filters.ip = { contains: ip };
        if (userAgent) filters.userAgent = { contains: userAgent };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [logs, total] = await Promise.all([
            prisma.requestLog.findMany({
                where: filters,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.requestLog.count({ where: filters }),
        ]);

        if (exportType === "csv") {
            const parser = new Parser();
            const csv = parser.parse(logs);
            res.header("Content-Type", "text/csv");
            res.attachment("logs.csv");
            return res.send(csv);
        }

        if (exportType === "xlsx") {
            const worksheet = XLSX.utils.json_to_sheet(logs);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
            res.header("Content-Disposition", "attachment; filename=logs.xlsx");
            res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            return res.send(buffer);
        }

        return res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: logs,
        });
    } catch (err) {
        console.error("Query Logs Error:", err.message);
        res.status(500).json({ message: "Internal error" });
    }
};
