// src/controllers/friends/getAllRequest.ts

import { Response } from 'express';
import pool from '../../config/dataBase';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

/**
 * Контроллер: возвращает входящие и исходящие заявки в друзья.
 * 
 * Структура таблицы user_friends:
 *   user_id    integer    PRIMARY KEY, FK → users(id)
 *   friends    integer[]  массив id друзей
 *   requests   integer[]  массив id пользователей, которые отправили заявку
 *
 * Мы не храним sent_requests:
 *   → чтобы получить список тех, кому вы отправили заявку,
 *     ищем все записи user_friends, где ваш userId содержится в поле requests.
 */
export async function getFriendRequests(
  req: AuthenticatedRequest,
  res: Response
): Promise<any> {
  try {
    // 1) Проверка авторизации
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return;
    }
    const currentUserId = req.user.id;

    // 2) Сначала получаем входящие заявки: массив requests текущего пользователя
    const incomingResult = await pool.query(
      `SELECT requests
         FROM user_friends
        WHERE user_id = $1`,
      [currentUserId]
    );

    // Если записи для currentUserId нет, то просто вернём пустые списки
    if (incomingResult.rowCount === 0) {
      return res.status(200).json({
        received: [],
        sent: [],
      });
    }

    const rawIncoming = incomingResult.rows[0].requests;

    // Функция-помощник, чтобы преобразовать raw массив (string или SQL-ARRAY) в number[]
    const parseArray = (raw: any): number[] => {
      if (!raw) return [];
      if (typeof raw === 'string') {
        // строка вида "{2,5,7}"
        return raw
          .replace(/[{}]/g, '')
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));
      } else if (Array.isArray(raw)) {
        return raw as number[];
      } else {
        return [];
      }
    };

    const incomingIds: number[] = parseArray(rawIncoming);

    // 3) Параллельно ищем исходящие заявки:
    //    находим все user_id, где в requests содержится currentUserId
    //    они обозначают, что вы (currentUserId) уже отправили этим пользователям заявку
    const outgoingResult = await pool.query(
      `SELECT user_id
         FROM user_friends
        WHERE $1 = ANY(requests)`,
      [currentUserId]
    );

    // Сюда попадут строки вида { user_id: 10 }, { user_id: 15 }, ...
    const outgoingUserIds: number[] = outgoingResult.rows.map((row) => row.user_id);

    // 4) Если incomingIds непустой, грузим детали этих пользователей
    const incomingUsers =
      incomingIds.length > 0
        ? (
            await pool.query(
              `SELECT id, user_name, email, icon_url
                 FROM users
                WHERE id = ANY($1::int[])`,
              [incomingIds]
            )
          ).rows
        : [];

    // 5) Если outgoingUserIds непустой, грузим детали этих пользователей
    const outgoingUsers =
      outgoingUserIds.length > 0
        ? (
            await pool.query(
              `SELECT id, user_name, email, icon_url
                 FROM users
                WHERE id = ANY($1::int[])`,
              [outgoingUserIds]
            )
          ).rows
        : [];

    // 6) Возвращаем полный объект
    return res.status(200).json({
      received: incomingUsers,
      sent: outgoingUsers,
    });
  } catch (error) {
    console.error('Ошибка при получении запросов в друзья:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении запросов в друзья' });
  }
}
