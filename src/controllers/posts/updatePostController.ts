import { Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

export const updatePost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const postId = parseInt(req.params.id, 10);

    if (isNaN(postId)) {
      res.status(400).json({ message: "Некорректный ID поста" });
      return;
    }

    const { title, description, img, is_public } = req.body;

    // Получаем пост
    const postResult = await pool.query(
      `SELECT author_id FROM posts WHERE id = $1`,
      [postId]
    );

    if (postResult.rows.length === 0) {
      res.status(404).json({ message: "Пост не найден" });
      return;
    }

    const post = postResult.rows[0];

    if (post.author_id !== userId) {
      res
        .status(403)
        .json({ message: "У вас нет прав на редактирование этого поста" });
      return;
    }

    // Обновляем только переданные поля
    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      fieldsToUpdate.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      fieldsToUpdate.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (img !== undefined) {
      fieldsToUpdate.push(`img = $${paramIndex++}`);
      values.push(img);
    }
    if (is_public !== undefined) {
      fieldsToUpdate.push(`is_public = $${paramIndex++}`);
      values.push(is_public);
    }

    if (fieldsToUpdate.length === 0) {
      res.status(400).json({ message: "Нет полей для обновления" });
      return;
    }

    // Обязательно ставим was_edited = true
    fieldsToUpdate.push(`was_edited = true`);

    values.push(postId);

    const updateQuery = `
      UPDATE posts
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, values);

    res.status(200).json({
      message: "Пост успешно обновлён",
      post: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при обновлении поста:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
