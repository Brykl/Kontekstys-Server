"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePostsForProfile = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const getAvailablePostsForProfile = async (req, res) => {
    try {
        const viewerId = req.user?.id;
        const username = req.params.username;
        if (!viewerId) {
            res.status(401).json({ message: "Пользователь не авторизован" });
            return;
        }
        // Получаем ID пользователя, чей профиль просматривается
        const userResult = await dataBase_1.default.query("SELECT id FROM users WHERE user_name = $1", [username]);
        if (userResult.rowCount === 0) {
            res.status(404).json({ message: "Пользователь не найден" });
            return;
        }
        const profileUserId = userResult.rows[0].id;
        // Получаем посты с количеством лайков/дизлайков и реакцией текущего пользователя
        const postsResult = await dataBase_1.default.query(`
  SELECT 
    p.*,
    COUNT(pr_likes.id) FILTER (WHERE pr_likes.is_like = TRUE) AS like_count,
    COUNT(pr_likes.id) FILTER (WHERE pr_likes.is_dislike = TRUE) AS dislike_count,
    CASE 
      WHEN pr_viewer.is_like = TRUE THEN 'like'
      WHEN pr_viewer.is_dislike = TRUE THEN 'dislike'
      ELSE NULL
    END AS viewer_reaction
  FROM posts p
  LEFT JOIN post_reactions pr_likes ON pr_likes.post_id = p.id
  LEFT JOIN post_reactions pr_viewer ON pr_viewer.post_id = p.id AND pr_viewer.user_id = $2
  WHERE p.author_id = $1
    AND (
      p.is_public = true
      OR p.id IN (
        SELECT post_id
        FROM post_access
        WHERE user_id = $2
      )
    )
  GROUP BY p.id, pr_viewer.is_like, pr_viewer.is_dislike
  ORDER BY p.created_at DESC;
  `, [profileUserId, viewerId]);
        res.status(200).json({
            message: "Доступные посты получены",
            posts: postsResult.rows,
        });
    }
    catch (error) {
        console.error("Ошибка при получении постов:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.getAvailablePostsForProfile = getAvailablePostsForProfile;
