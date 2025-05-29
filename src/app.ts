import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import registrationRoute from "./routes/authorization/registrationRoute";
import loginRoute from "./routes/authorization/loginRoute";
import profile from "./routes/profile";
import getPostsRoute from "./routes/posts/getPostsRoute";
import createPostRoute from "./routes/posts/createPostRoute";
import updatePostRoute from "./routes/posts/updatePostRoute";
import verifyToken from "./routes/authorization/verifyToken";
import getPostsRouteProfile from "./routes/posts/getPostsProfileRoute";
import reactions from "./routes/posts/reactions";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://172.30.253.7:5173",
    credentials: true,
  })
);

// подключение маршрутов
app.use("/api/auth", registrationRoute);
app.use("/api/auth", loginRoute);
app.use("/api/", profile);
app.use("/api", getPostsRoute);
app.use("/api", createPostRoute);
app.use("/api", updatePostRoute);
app.use("/api", verifyToken);
app.use("/api", getPostsRouteProfile);
app.use("/api/reactions", reactions);

app.use(errorHandler);

export default app;
