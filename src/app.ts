import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import registrationRoute from "./routes/authorization/registrationRoute";
import loginRoute from "./routes/authorization/loginRoute";
import profile from "./routes/profile";
import getPostsRoute from "./routes/posts/getPostsRoute";
import createPostRoute from "./routes/posts/createPostRoute";
import updatePostRoute from "./routes/posts/updatePostRoute";

const app = express();

app.use(express.json());

app.use("/api/auth", registrationRoute);
app.use("/api/auth", loginRoute);
app.use("/api/", profile);
app.use("/api", getPostsRoute);
app.use("/api", createPostRoute);
app.use("/api", updatePostRoute);
//routes here...

app.use(errorHandler);

export default app;
