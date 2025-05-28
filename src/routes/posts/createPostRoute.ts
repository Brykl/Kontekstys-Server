import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { createPost } from "../../controllers/posts/createPostController";

const router = express.Router();

router.post("/posts", verifyToken, createPost);

export default router;
