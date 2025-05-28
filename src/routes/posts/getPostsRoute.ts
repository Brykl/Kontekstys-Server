import express from "express";
import { getAvailablePosts } from "../../controllers/posts/getAllPostsController";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/posts", verifyToken, getAvailablePosts);

export default router;
