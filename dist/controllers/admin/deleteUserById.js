"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const deleteUserById = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Нет прав доступа" });
    }
    const userId = parseInt(req.params.userId, 10);
    try {
        await dataBase_1.default.query("DELETE FROM users WHERE id = $1", [userId]);
        res.status(200).json({ message: "Пользователь удалён" });
    }
    catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        res.status(500).json({ message: "Не удалось удалить пользователя" });
    }
};
exports.deleteUserById = deleteUserById;
