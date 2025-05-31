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
import deletePosts from "./routes/posts/deletePostsRoute";
import uploadIcon from "./routes/icon";
import iconSender from "./routes/profile/iconSender";
import findFriends from "./routes/friends/friendsRoute";
import getAllFriends from "./routes/friends/getAllFriends";
import sendFriends from "./routes/friends/sendFriendRequest";
import acceptFriend from "./routes/friends/acceptFriendRequest";
import getAllRequest from "./routes/friends/getAllRequest";
import rejectFriendRequest from "./routes/friends/rejectFreinds";
import removeFriend from "./routes/friends/removeFriend";
import adminRoute from "./routes/admin/adminRoute";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://172.30.0.66:5173",
    credentials: true,
  })
);

// подключение маршрутов
app.use("/api/admin", adminRoute);
app.use("/api/auth", registrationRoute);
app.use("/api/auth", loginRoute);
app.use("/api/", profile);
app.use("/api", getPostsRoute);
app.use("/api", createPostRoute);
app.use("/api", updatePostRoute);
app.use("/api", verifyToken);
app.use("/api", getPostsRouteProfile);
app.use("/api", findFriends);
app.use("/api/reactions", reactions);
app.use("/api", deletePosts);
app.use("/api/load", uploadIcon);
app.use("/api", iconSender);
app.use("/api", getAllFriends);
app.use("/api", getAllFriends);
app.use("/api", sendFriends);
app.use("/api", sendFriends);
app.use("/api", acceptFriend);
app.use("/api", getAllRequest);
app.use("/api", rejectFriendRequest);
app.use("/api", removeFriend);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/icons", express.static(path.join(__dirname, "../public/icons")));

app.use(errorHandler);

export default app;
