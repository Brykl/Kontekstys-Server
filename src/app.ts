import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import registrationRoute from "./routes/registrationRoute";
import loginRoute from "./routes/loginRoute";

const app = express();

app.use(express.json());

app.use("/api/auth", registrationRoute);
app.use("/api/auth", loginRoute);
//routes here...

app.use(errorHandler);

export default app;
