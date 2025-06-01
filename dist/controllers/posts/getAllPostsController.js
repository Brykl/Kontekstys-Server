"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePosts = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const getAvailablePosts = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }
        const result = await dataBase_1.default.query(`
  SELECT 
    p.id,
    p.title,
    p.description,
    p.created_at,
    p.was_edited,
    p.access_type, -- ✅ Вот это поле нужно
    p.img,
    u.user_name AS author_name,
    COUNT(pr_likes.id) FILTER (WHERE pr_likes.is_like = TRUE) AS like_count,
    COUNT(pr_likes.id) FILTER (WHERE pr_likes.is_dislike = TRUE) AS dislike_count,
    CASE 
      WHEN pr_viewer.is_like = TRUE THEN 'like'
      WHEN pr_viewer.is_dislike = TRUE THEN 'dislike'
      ELSE NULL
    END AS viewer_reaction
  FROM posts p
  JOIN users u ON u.id = p.author_id
  LEFT JOIN post_reactions pr_likes ON pr_likes.post_id = p.id
  LEFT JOIN post_reactions pr_viewer ON pr_viewer.post_id = p.id AND pr_viewer.user_id = $1
  WHERE p.access_type = 'public'
     OR p.id IN (
       SELECT post_id
       FROM post_access
       WHERE user_id = $1
     )
  GROUP BY p.id, u.user_name, pr_viewer.is_like, pr_viewer.is_dislike
  ORDER BY p.created_at DESC;
  `, [userId]);
        res.status(200).json({
            message: "Доступные посты получены",
            posts: result.rows,
        });
    }
    catch (error) {
        console.error("Ошибка при получении постов:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.getAvailablePosts = getAvailablePosts;
