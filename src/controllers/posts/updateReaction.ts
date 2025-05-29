// src/controllers/posts/updateReaction.ts
import { RequestHandler, Response, NextFunction } from "express";
import { QueryResult } from "pg";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

// Обновление или удаление реакции
export const updateReaction: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { postId, reactionType } = req.body; // 'like' | 'dislike' | 'none'

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    if (
      typeof postId !== "number" ||
      !["like", "dislike", "none"].includes(reactionType)
    ) {
      res.status(400).json({ message: "Неверные параметры" });
      return;
    }

    // Проверяем существование реакции
    const existingReaction: QueryResult<{ id: number }> = await pool.query(
      "SELECT id FROM post_reactions WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );
    const existCount = existingReaction.rowCount ?? 0;
    if (existCount === 0) {
      res
        .status(404)
        .json({ message: "Реакция не найдена, используйте создание" });
      return;
    }

    if (reactionType === "none") {
      // Удаляем реакцию
      await pool.query(
        "DELETE FROM post_reactions WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );
      res.status(200).json({ message: "Реакция удалена" });
      return;
    }

    const is_like = reactionType === "like";
    const is_dislike = reactionType === "dislike";

    await pool.query(
      "UPDATE post_reactions SET is_like = $1, is_dislike = $2 WHERE post_id = $3 AND user_id = $4",
      [is_like, is_dislike, postId, userId]
    );

    res.status(200).json({ message: "Реакция обновлена" });
  } catch (err) {
    console.error("Ошибка при обновлении реакции:", err);
    next(err);
  }
};
