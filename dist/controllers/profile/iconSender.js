"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconByUsername = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const getIconByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(400).json({ error: "Имя пользователя не указано" });
            return;
        }
        const result = await dataBase_1.default.query("SELECT icon_url FROM users WHERE user_name = $1", [username]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Пользователь не найден" });
            return;
        }
        const iconUrl = result.rows[0].icon_url;
        res.status(200).json({ iconUrl });
    }
    catch (error) {
        console.error("Ошибка при получении иконки:", error);
        res.status(500).json({ error: "Ошибка сервера при получении иконки" });
    }
};
exports.getIconByUsername = getIconByUsername;
