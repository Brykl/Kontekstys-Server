import { Response } from 'express';
import pool from '../../config/dataBase';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

/**
 * Контроллер: Получает всех пользователей, отправивших заявки текущему пользователю.
 */
export async function getFriendRequests(
  req: AuthenticatedRequest,
  res: Response
): Promise<any> {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return;
    }

    const userId = req.user.id;

    // Получаем requests как строку или массив
    const { rows } = await pool.query(
      `SELECT requests FROM user_friends WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    const rawRequests = rows[0].requests;

    // Обработка как строки, например "{1,2,3}" -> [1, 2, 3]
    let requestIds: number[] = [];

    if (typeof rawRequests === 'string') {
      requestIds = rawRequests
        .replace(/[{}]/g, '') // удаляем фигурные скобки
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));
    } else if (Array.isArray(rawRequests)) {
      requestIds = rawRequests;
    }

    if (requestIds.length === 0) {
      return res.status(200).json([]);
    }

    // Получаем пользователей, которые отправили запрос
    const usersResult = await pool.query(
      `SELECT id, user_name, email FROM users WHERE id = ANY($1::int[])`,
      [requestIds]
    );

    return res.status(200).json(usersResult.rows);
  } catch (error) {
    console.error('Ошибка при получении запросов в друзья:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении запросов в друзья' });
  }
}
