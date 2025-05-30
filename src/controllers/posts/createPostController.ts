import { Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const authorId = req.user?.id;
    const { title, description, is_public, allow } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description) {
      res
        .status(400)
        .json({ message: "Заполните обязательные поля: title и description" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO posts (author_id, title, description, img, is_public)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [authorId, title, description, imagePath, is_public ?? true]
    );

    const postId = result.rows[0].id;

    if (is_public === false) {
      const userIds: number[] = [authorId];

      if (Array.isArray(allow) && allow.length > 0) {
        const usersResult = await pool.query(
          `SELECT id FROM users WHERE user_name = ANY($1)`,
          [allow]
        );
        const allowedUserIds = usersResult.rows.map((row) => row.id);
        for (const uid of allowedUserIds) {
          if (!userIds.includes(uid)) userIds.push(uid);
        }
      }

      for (const userId of userIds) {
        await pool.query(
          `INSERT INTO post_access (post_id, user_id) VALUES ($1, $2)`,
          [postId, userId]
        );
      }
    }

    res.status(201).json({
      message: "Пост успешно создан",
      post: { id: postId, title, description, img: imagePath, is_public },
    });
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
