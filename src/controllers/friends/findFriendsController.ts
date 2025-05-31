import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import pool from '../../config/dataBase';

export async function searchUsersHandler(req: AuthenticatedRequest, res: Response): Promise<any> {
  try {
    const searchQuery = (req.query.q as string) || '';
    if (!searchQuery.trim()) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const currentUserName = (req.user && req.user.user_name) as string;
    if (!currentUserName) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userResult = await pool.query(
      'SELECT id FROM users WHERE user_name = $1',
      [currentUserName]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'Current user not found' });
    }
    const currentUserId = userResult.rows[0].id;

    const friendsResult = await pool.query(
      'SELECT friends FROM user_friends WHERE user_id = $1',
      [currentUserId]
    );

    const friendsIds: number[] = Array.isArray(friendsResult.rows?.[0]?.friends)
      ? friendsResult.rows[0].friends
      : [];

    const searchResult = await pool.query(
      `SELECT id, user_name, email FROM users
       WHERE user_name ILIKE '%' || $1 || '%'
       AND id != $2
       AND id NOT IN (SELECT unnest($3::int[]))
       ORDER BY user_name
       LIMIT 20`,
      [searchQuery, currentUserId, friendsIds.length ? friendsIds : [-1]]
    );

    res.json(searchResult.rows);
  } catch (error) {
    console.error('Ошибка при поиске пользователей:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
