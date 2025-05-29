import express from "express";
import { getAvailablePostsForProfile } from "../../controllers/posts/getAvailablePostForProfiles";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/posts/:username", verifyToken, getAvailablePostsForProfile);

export default router;
