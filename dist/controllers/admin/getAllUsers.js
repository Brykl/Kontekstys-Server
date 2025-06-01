"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const getAllUsers = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Нет прав доступа" });
    }
    try {
        const result = await dataBase_1.default.query(`SELECT id, user_name, email, role, status, created_at FROM users ORDER BY created_at DESC`);
        res.status(200).json({ users: result.rows });
    }
    catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.getAllUsers = getAllUsers;
