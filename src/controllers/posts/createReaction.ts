// src/controllers/posts/createReaction.ts
import { RequestHandler, Response, NextFunction } from "express";
import { QueryResult } from "pg";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

// Создание реакции
export const createReaction: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { postId, reactionType } = req.body; // 'like' | 'dislike'

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    if (
      typeof postId !== "number" ||
      !["like", "dislike"].includes(reactionType)
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
    if (existCount > 0) {
      res
        .status(409)
        .json({ message: "Реакция уже существует. Используйте обновление." });
      return;
    }

    const is_like = reactionType === "like";
    const is_dislike = reactionType === "dislike";

    await pool.query(
      "INSERT INTO post_reactions (post_id, user_id, is_like, is_dislike) VALUES ($1, $2, $3, $4)",
      [postId, userId, is_like, is_dislike]
    );

    res.status(201).json({ message: "Реакция создана" });
  } catch (err) {
    console.error("Ошибка при создании реакции:", err);
    next(err);
  }
};
