import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { updatePost } from "../../controllers/posts/updatePostController";

const router = Router();

// Обновление поста (только автор имеет право)
router.patch("/posts/:id", verifyToken, updatePost);

export default router;
