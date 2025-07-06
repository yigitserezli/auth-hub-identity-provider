import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import logRoutes from "./routes/log.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from './middlewares/requestLogger.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
