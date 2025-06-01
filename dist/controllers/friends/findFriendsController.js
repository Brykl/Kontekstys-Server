"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersHandler = searchUsersHandler;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
async function searchUsersHandler(req, res) {
    try {
        const searchQuery = req.query.q || '';
        if (!searchQuery.trim()) {
            return res.status(400).json({ error: 'Query parameter q is required' });
        }
        const currentUserName = (req.user && req.user.user_name);
        if (!currentUserName) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userResult = await dataBase_1.default.query('SELECT id FROM users WHERE user_name = $1', [currentUserName]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'Current user not found' });
        }
        const currentUserId = userResult.rows[0].id;
        const friendsResult = await dataBase_1.default.query('SELECT friends FROM user_friends WHERE user_id = $1', [currentUserId]);
        const friendsIds = Array.isArray(friendsResult.rows?.[0]?.friends)
            ? friendsResult.rows[0].friends
            : [];
        const searchResult = await dataBase_1.default.query(`SELECT id, user_name, email FROM users
       WHERE user_name ILIKE '%' || $1 || '%'
       AND id != $2
       AND id NOT IN (SELECT unnest($3::int[]))
       ORDER BY user_name
       LIMIT 20`, [searchQuery, currentUserId, friendsIds.length ? friendsIds : [-1]]);
        res.json(searchResult.rows);
    }
    catch (error) {
        console.error('Ошибка при поиске пользователей:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
