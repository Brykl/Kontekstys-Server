"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadIcon = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// 📥 Контроллер: сохраняет иконку и путь в БД
const uploadIcon = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Пользователь не авторизован" });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "Файл не загружен" });
            return;
        }
        const iconPath = `/icons/${file.filename}`;
        await dataBase_1.default.query("UPDATE users SET icon_url = $1 WHERE id = $2", [
            iconPath,
            userId,
        ]);
        res.status(200).json({ success: true, iconPath });
    }
    catch (error) {
        console.error("Ошибка при загрузке иконки:", error);
        res.status(500).json({ error: "Ошибка загрузки иконки" });
    }
};
exports.uploadIcon = uploadIcon;
