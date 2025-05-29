import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/verify", verifyToken, (req: AuthenticatedRequest, res) => {
  res.json({
    message: "Вы успешно авторизованы",
    user: req.user, // Только безопасные данные
  });
});

export default router;
