"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBlockUser = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const toggleBlockUser = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Нет прав доступа" });
    }
    const userId = parseInt(req.params.userId, 10);
    const action = req.params.action; // 'block' или 'unblock'
    if (!["block", "unblock"].includes(action)) {
        return res.status(400).json({ message: "Недопустимое действие" });
    }
    const newStatus = action === "block" ? false : true;
    try {
        await dataBase_1.default.query("UPDATE users SET status = $1 WHERE id = $2", [
            newStatus,
            userId,
        ]);
        res.status(200).json({
            message: `Пользователь ${action === "block" ? "заблокирован" : "разблокирован"}`,
        });
    }
    catch (error) {
        console.error("Ошибка при изменении статуса пользователя:", error);
        res.status(500).json({ message: "Не удалось обновить статус" });
    }
};
exports.toggleBlockUser = toggleBlockUser;
