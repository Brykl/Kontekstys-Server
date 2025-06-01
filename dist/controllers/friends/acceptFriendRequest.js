"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequest = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// Контроллер для принятия заявки в друзья
const acceptFriendRequest = async (req, res) => {
    try {
        const currentUser = req.user;
        const { requesterId } = req.body; // ID того, кто отправил запрос
        if (!currentUser || !currentUser.id) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }
        if (!requesterId) {
            res.status(400).json({ message: "Не указан ID отправителя запроса" });
            return;
        }
        const currentUserId = currentUser.id;
        // Удалить requesterId из requests текущего пользователя
        await dataBase_1.default.query(`UPDATE user_friends 
       SET requests = array_remove(requests, $1)
       WHERE user_id = $2`, [requesterId, currentUserId]);
        // Добавить requesterId в friends текущего пользователя
        await dataBase_1.default.query(`UPDATE user_friends 
       SET friends = array_append(friends, $1)
       WHERE user_id = $2`, [requesterId, currentUserId]);
        // Добавить текущего пользователя в friends у requester'а
        await dataBase_1.default.query(`UPDATE user_friends 
       SET friends = array_append(friends, $1)
       WHERE user_id = $2`, [currentUserId, requesterId]);
        res.status(200).json({ message: "Заявка принята. Теперь вы друзья." });
    }
    catch (error) {
        console.error("Ошибка при принятии заявки в друзья:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.acceptFriendRequest = acceptFriendRequest;
