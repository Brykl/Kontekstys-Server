import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
//routes here...

app.use(errorHandler);

export default app;
