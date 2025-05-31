import { Request, Response } from 'express';
import pool from '../../config/dataBase';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

// Контроллер для удаления друга
export const removeFriend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUser = req.user;
    const { friendId } = req.body;

    if (!currentUser || !currentUser.id) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return;
    }

    if (!friendId) {
      res.status(400).json({ message: 'Не указан ID друга для удаления' });
      return;
    }

    const currentUserId = currentUser.id;

    // Удалить friendId из массива друзей текущего пользователя
    await pool.query(
      `UPDATE user_friends 
       SET friends = array_remove(friends, $1)
       WHERE user_id = $2`,
      [friendId, currentUserId]
    );

    // Удалить currentUserId из массива друзей друга
    await pool.query(
      `UPDATE user_friends 
       SET friends = array_remove(friends, $1)
       WHERE user_id = $2`,
      [currentUserId, friendId]
    );

    res.status(200).json({ message: 'Друг успешно удалён' });
  } catch (error) {
    console.error('Ошибка при удалении друга:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
