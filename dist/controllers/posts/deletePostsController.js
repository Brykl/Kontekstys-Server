"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const deletePostById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id: postId } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }
        // Проверяем, существует ли пост и кто его автор
        const postResult = await dataBase_1.default.query("SELECT author_id FROM posts WHERE id = $1", [postId]);
        if (postResult.rowCount === 0) {
            res.status(404).json({ message: "Пост не найден" });
            return;
        }
        const authorId = postResult.rows[0].author_id;
        if (authorId !== userId) {
            res.status(403).json({ message: "Вы не автор этого поста" });
            return;
        }
        // Удаляем реакции на пост
        await dataBase_1.default.query("DELETE FROM post_reactions WHERE post_id = $1", [postId]);
        // Удаляем доступы к посту (если есть)
        await dataBase_1.default.query("DELETE FROM post_access WHERE post_id = $1", [postId]);
        // Удаляем сам пост
        await dataBase_1.default.query("DELETE FROM posts WHERE id = $1", [postId]);
        res
            .status(200)
            .json({ message: "Пост и связанные реакции успешно удалены" });
    }
    catch (error) {
        console.error("Ошибка при удалении поста:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.deletePostById = deletePostById;
