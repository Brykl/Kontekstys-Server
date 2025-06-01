"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriend = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// Контроллер для удаления друга
const removeFriend = async (req, res) => {
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
        await dataBase_1.default.query(`UPDATE user_friends 
       SET friends = array_remove(friends, $1)
       WHERE user_id = $2`, [friendId, currentUserId]);
        // Удалить currentUserId из массива друзей друга
        await dataBase_1.default.query(`UPDATE user_friends 
       SET friends = array_remove(friends, $1)
       WHERE user_id = $2`, [currentUserId, friendId]);
        res.status(200).json({ message: 'Друг успешно удалён' });
    }
    catch (error) {
        console.error('Ошибка при удалении друга:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};
exports.removeFriend = removeFriend;
