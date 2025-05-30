// routes/postRoutes.ts
import express from "express";
import { deletePostById } from "../../controllers/posts/deletePostsController";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.delete("/posts/:id", verifyToken, deletePostById);

export default router;
