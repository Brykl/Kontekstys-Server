"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendsHandler = getFriendsHandler;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// Получить список друзей текущего пользователя
async function getFriendsHandler(req, res) {
    try {
        const currentUserName = req.user?.user_name;
        if (!currentUserName) {
            return res.status(401).json({ error: 'Пользователь не авторизован' });
        }
        // Получаем ID текущего пользователя
        const userResult = await dataBase_1.default.query('SELECT id FROM users WHERE user_name = $1', [currentUserName]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const currentUserId = userResult.rows[0].id;
        // Получаем список ID друзей
        const friendsResult = await dataBase_1.default.query('SELECT friends FROM user_friends WHERE user_id = $1', [currentUserId]);
        const friendIds = friendsResult.rows?.[0]?.friends ?? [];
        if (friendIds.length === 0) {
            return res.json([]);
        }
        // Получаем информацию о друзьях (включая icon_url)
        const usersResult = await dataBase_1.default.query(`SELECT id, user_name, email, icon_url FROM users WHERE id = ANY($1::int[])`, [friendIds]);
        res.json(usersResult.rows);
    }
    catch (error) {
        console.error('Ошибка при получении друзей:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении друзей' });
    }
}
