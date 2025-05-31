import { Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

export const deleteUserById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Нет прав доступа" });
  }

  const userId = parseInt(req.params.userId, 10);

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(200).json({ message: "Пользователь удалён" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ message: "Не удалось удалить пользователя" });
  }
};
