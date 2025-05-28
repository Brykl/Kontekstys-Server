import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import registrationRoute from "./routes/registrationRoute";
import loginRoute from "./routes/loginRoute";
import profile from "./routes/profile";
import getPostsRoute from "./routes/getPostsRoute";

const app = express();

app.use(express.json());

app.use("/api/auth", registrationRoute);
app.use("/api/auth", loginRoute);
app.use("/api/", profile);
app.use("/api", getPostsRoute);
//routes here...

app.use(errorHandler);

export default app;
