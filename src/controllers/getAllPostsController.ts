import { Response } from "express";
import pool from "../config/dataBase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // Тип как в middleware

export const getAvailablePosts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    const result = await pool.query(
      `
      SELECT *
      FROM posts
      WHERE is_public = true
         OR id IN (
             SELECT post_id
             FROM post_access
             WHERE user_id = $1
         )
      ORDER BY created_at DESC;
      `,
      [userId]
    );

    res.status(200).json({
      message: "Доступные посты получены",
      posts: result.rows,
    });
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
