import express from "express";
import { getIconByUsername } from "../../controllers/profile/iconSender";

const router = express.Router();

// 🔓 GET /api/icon/:username — получить icon_url по имени
router.get("/icon/:username", getIconByUsername);

export default router;
