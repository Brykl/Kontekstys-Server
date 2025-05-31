import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import pool from '../../config/dataBase';

// Получить список друзей текущего пользователя
export async function getFriendsHandler(req: AuthenticatedRequest, res: Response): Promise<any> {
  try {
    const currentUserName = req.user?.user_name;

    if (!currentUserName) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }

    // Получаем ID текущего пользователя
    const userResult = await pool.query(
      'SELECT id FROM users WHERE user_name = $1',
      [currentUserName]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const currentUserId = userResult.rows[0].id;

    // Получаем список ID друзей
    const friendsResult = await pool.query(
      'SELECT friends FROM user_friends WHERE user_id = $1',
      [currentUserId]
    );

    const friendIds: number[] = friendsResult.rows?.[0]?.friends ?? [];

    if (friendIds.length === 0) {
      return res.json([]);
    }

    // Получаем информацию о друзьях (включая icon_url)
    const usersResult = await pool.query(
      `SELECT id, user_name, email, icon_url FROM users WHERE id = ANY($1::int[])`,
      [friendIds]
    );

    res.json(usersResult.rows);
  } catch (error) {
    console.error('Ошибка при получении друзей:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении друзей' });
  }
}
