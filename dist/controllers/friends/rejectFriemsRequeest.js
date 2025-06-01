"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectFriendRequest = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// Контроллер для отклонения заявки в друзья
const rejectFriendRequest = async (req, res) => {
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
        // Удалить requesterId из массива requests текущего пользователя
        await dataBase_1.default.query(`UPDATE user_friends
       SET requests = array_remove(requests, $1)
       WHERE user_id = $2`, [requesterId, currentUserId]);
        res.status(200).json({ message: "Заявка отклонена" });
    }
    catch (error) {
        console.error("Ошибка при отклонении заявки в друзья:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.rejectFriendRequest = rejectFriendRequest;
