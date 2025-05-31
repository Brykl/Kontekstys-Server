import { Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Нет прав доступа" });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_name, email, role, status, created_at FROM users ORDER BY created_at DESC`
    );
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
