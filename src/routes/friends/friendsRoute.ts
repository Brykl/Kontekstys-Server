import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { searchUsersHandler } from "../../controllers/friends/findFriendsController";

const router = express.Router();

// Обязательно именно GET, чтобы совпадало с клиентским запросом
router.get("/friends/find", verifyToken, searchUsersHandler);

export default router;
