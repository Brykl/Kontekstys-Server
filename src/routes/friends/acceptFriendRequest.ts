import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { acceptFriendRequest } from "../../controllers/friends/acceptFriendRequest";

const router = express.Router();

router.post("/friends/accept", verifyToken, acceptFriendRequest);

export default router;
