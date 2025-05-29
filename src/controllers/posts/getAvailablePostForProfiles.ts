import { Response, Request } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

export const getAvailablePostsForProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const viewerId = req.user?.id;
    const username = req.params.username;

    if (!viewerId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE user_name = $1",
      [username]
    );

    if (userResult.rowCount === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    const profileUserId = userResult.rows[0].id;

    const postsResult = await pool.query(
      `
      SELECT *
      FROM posts
      WHERE author_id = $1
        AND (
          is_public = true
          OR id IN (
            SELECT post_id
            FROM post_access
            WHERE user_id = $2
          )
        )
      ORDER BY created_at DESC;
      `,
      [profileUserId, viewerId]
    );

    res.status(200).json({
      message: "Доступные посты получены",
      posts: postsResult.rows,
    });
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
