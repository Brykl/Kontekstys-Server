"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReaction = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
// Создание реакции
const createReaction = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { postId, reactionType } = req.body; // 'like' | 'dislike'
        if (!userId) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }
        if (typeof postId !== "number" ||
            !["like", "dislike"].includes(reactionType)) {
            res.status(400).json({ message: "Неверные параметры" });
            return;
        }
        // Проверяем существование реакции
        const existingReaction = await dataBase_1.default.query("SELECT id FROM post_reactions WHERE post_id = $1 AND user_id = $2", [postId, userId]);
        const existCount = existingReaction.rowCount ?? 0;
        if (existCount > 0) {
            res
                .status(409)
                .json({ message: "Реакция уже существует. Используйте обновление." });
            return;
        }
        const is_like = reactionType === "like";
        const is_dislike = reactionType === "dislike";
        await dataBase_1.default.query("INSERT INTO post_reactions (post_id, user_id, is_like, is_dislike) VALUES ($1, $2, $3, $4)", [postId, userId, is_like, is_dislike]);
        res.status(201).json({ message: "Реакция создана" });
    }
    catch (err) {
        console.error("Ошибка при создании реакции:", err);
        next(err);
    }
};
exports.createReaction = createReaction;
