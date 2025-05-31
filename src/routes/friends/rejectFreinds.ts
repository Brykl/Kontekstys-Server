import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { rejectFriendRequest } from "../../controllers/friends/rejectFriemsRequeest";

const router = express.Router();

// Отклонить заявку в друзья
router.post("/friends/reject", verifyToken, rejectFriendRequest);

export default router;
