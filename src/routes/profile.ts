import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Приватный маршрут
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Добро пожаловать в профиль", user: (req as any).user });
});

export default router;
