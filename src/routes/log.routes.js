import express from "express";
import { getAllLogs, getLatestLogs, getLogsByDateRange, queryLogs } from "../controllers/log.controller.js";

const router = express.Router();

router.get("/query", queryLogs);

router.get("/all", getAllLogs);
router.get("/latest", getLatestLogs);

router.get("/today", (req, res) => getLogsByDateRange("today", res));
router.get("/yesterday", (req, res) => getLogsByDateRange("yesterday", res));
router.get("/last-7-days", (req, res) => getLogsByDateRange("7", res));
router.get("/last-14-days", (req, res) => getLogsByDateRange("14", res));
router.get("/last-30-days", (req, res) => getLogsByDateRange("30", res));
router.get("/last-90-days", (req, res) => getLogsByDateRange("90", res));
router.get("/last-180-days", (req, res) => getLogsByDateRange("180", res));
router.get("/last-1-year", (req, res) => getLogsByDateRange("365", res));
router.get("/last-2-years", (req, res) => getLogsByDateRange("730", res));

export default router;
