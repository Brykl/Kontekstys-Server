import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { sendFriendRequest } from "../../controllers/friends/sendFriendRequest";

const router = express.Router();

router.post("/friends/request", verifyToken, sendFriendRequest);

export default router;
