import { Router } from "express";
import { createReaction } from "../../controllers/posts/createReaction";
import { updateReaction } from "../../controllers/posts/updateReaction";
import { verifyToken } from "../../middlewares/authMiddleware"; //

const router = Router();

// Создать реакцию (лайк/дизлайк)
router.post("/create", verifyToken, createReaction);

// Обновить или удалить реакцию
router.put("/update", verifyToken, updateReaction);

export default router;
