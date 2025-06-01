"use strict";
// src/controllers/friends/getAllRequest.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendRequests = getFriendRequests;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
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
async function getFriendRequests(req, res) {
    try {
        // 1) Проверка авторизации
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Пользователь не авторизован' });
            return;
        }
        const currentUserId = req.user.id;
        // 2) Сначала получаем входящие заявки: массив requests текущего пользователя
        const incomingResult = await dataBase_1.default.query(`SELECT requests
         FROM user_friends
        WHERE user_id = $1`, [currentUserId]);
        // Если записи для currentUserId нет, то просто вернём пустые списки
        if (incomingResult.rowCount === 0) {
            return res.status(200).json({
                received: [],
                sent: [],
            });
        }
        const rawIncoming = incomingResult.rows[0].requests;
        // Функция-помощник, чтобы преобразовать raw массив (string или SQL-ARRAY) в number[]
        const parseArray = (raw) => {
            if (!raw)
                return [];
            if (typeof raw === 'string') {
                // строка вида "{2,5,7}"
                return raw
                    .replace(/[{}]/g, '')
                    .split(',')
                    .map((s) => parseInt(s.trim(), 10))
                    .filter((n) => !isNaN(n));
            }
            else if (Array.isArray(raw)) {
                return raw;
            }
            else {
                return [];
            }
        };
        const incomingIds = parseArray(rawIncoming);
        // 3) Параллельно ищем исходящие заявки:
        //    находим все user_id, где в requests содержится currentUserId
        //    они обозначают, что вы (currentUserId) уже отправили этим пользователям заявку
        const outgoingResult = await dataBase_1.default.query(`SELECT user_id
         FROM user_friends
        WHERE $1 = ANY(requests)`, [currentUserId]);
        // Сюда попадут строки вида { user_id: 10 }, { user_id: 15 }, ...
        const outgoingUserIds = outgoingResult.rows.map((row) => row.user_id);
        // 4) Если incomingIds непустой, грузим детали этих пользователей
        const incomingUsers = incomingIds.length > 0
            ? (await dataBase_1.default.query(`SELECT id, user_name, email, icon_url
                 FROM users
                WHERE id = ANY($1::int[])`, [incomingIds])).rows
            : [];
        // 5) Если outgoingUserIds непустой, грузим детали этих пользователей
        const outgoingUsers = outgoingUserIds.length > 0
            ? (await dataBase_1.default.query(`SELECT id, user_name, email, icon_url
                 FROM users
                WHERE id = ANY($1::int[])`, [outgoingUserIds])).rows
            : [];
        // 6) Возвращаем полный объект
        return res.status(200).json({
            received: incomingUsers,
            sent: outgoingUsers,
        });
    }
    catch (error) {
        console.error('Ошибка при получении запросов в друзья:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении запросов в друзья' });
    }
}
