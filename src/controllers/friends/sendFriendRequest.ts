import { Request, Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";

// Добавление ID пользователя в requests массива
export const sendFriendRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const fromUserName = req.user?.user_name;
    const { toUserId } = req.body;

    if (!fromUserName || !toUserId) {
      return res.status(400).json({ error: "Недостаточно данных" });
    }

    // Получаем ID текущего пользователя
    const fromUserResult = await pool.query(
      "SELECT id FROM users WHERE user_name = $1",
      [fromUserName]
    );

    if (fromUserResult.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const fromUserId = fromUserResult.rows[0].id;

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "Нельзя отправить запрос самому себе" });
    }

    // Проверка: уже есть такой запрос?
    const existingRequest = await pool.query(
      `SELECT requests FROM user_friends WHERE user_id = $1`,
      [toUserId]
    );

    const currentRequests: number[] = existingRequest.rows?.[0]?.requests || [];

    if (currentRequests.includes(fromUserId)) {
      return res.status(409).json({ error: "Запрос уже отправлен" });
    }

    // Добавляем в requests
    await pool.query(
      `UPDATE user_friends
       SET requests = array_append(requests, $1)
       WHERE user_id = $2`,
      [fromUserId, toUserId]
    );

    return res.status(200).json({ message: "Запрос в друзья отправлен" });
  } catch (error) {
    console.error("Ошибка при отправке запроса в друзья:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};
