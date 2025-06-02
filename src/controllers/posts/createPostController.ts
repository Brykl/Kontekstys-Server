import { Response } from "express";
import pool from "../../config/dataBase";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { containsRussianMat } from "../../utils/badWordsFilter";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      res.status(401).json({ message: "Неавторизованный запрос" });
      return;
    }

    const { title, description, accessType } = req.body;
    const normalizedAccessType = (accessType || "public")
      .toString()
      .trim()
      .toLowerCase();

    if (!title || !description) {
      res
        .status(400)
        .json({ message: "Заполните обязательные поля: title и description" });
      return;
    }

    // --- Новая проверка на мат ---
    if (containsRussianMat(title) || containsRussianMat(description)) {
      res.status(400).json({
        message: "В тексте обнаружен запрещённый ненормативный контент!",
      });
      return;
    }
    // --- Конец новой проверки ---

    if (!["public", "private", "friends"].includes(normalizedAccessType)) {
      res.status(400).json({
        message:
          "Неверный параметр accessType. Допустимые значения: public, private, friends",
      });
      return;
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const isPublicFlag = normalizedAccessType === "public";

    const insertPostResult = await pool.query(
      `
        INSERT INTO public.posts
          (author_id, title, description, img, is_public, access_type)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `,
      [
        authorId,
        title,
        description,
        imagePath,
        isPublicFlag,
        normalizedAccessType,
      ]
    );

    const newPostId: number = insertPostResult.rows[0].id;

    if (normalizedAccessType === "private") {
      await pool.query(
        `
          INSERT INTO public.post_access (post_id, user_id)
          VALUES ($1, $2);
        `,
        [newPostId, authorId]
      );
    } else if (normalizedAccessType === "friends") {
      const friendsResult = await pool.query<{ friends: number[] }>(
        `
          SELECT friends
          FROM public.user_friends
          WHERE user_id = $1;
        `,
        [authorId]
      );

      const friendsArray: number[] =
        friendsResult.rows.length > 0 ? friendsResult.rows[0].friends : [];

      const accessUserIdsSet = new Set<number>();
      accessUserIdsSet.add(authorId);
      for (const fid of friendsArray) {
        if (typeof fid === "number") {
          accessUserIdsSet.add(fid);
        }
      }

      const insertAccessText =
        "INSERT INTO public.post_access (post_id, user_id) VALUES ($1, $2);";
      for (const uid of accessUserIdsSet) {
        await pool.query(insertAccessText, [newPostId, uid]);
      }
    }

    res.status(201).json({
      message: "Пост успешно создан",
      post: {
        id: newPostId,
        title,
        description,
        img: imagePath,
        accessType: normalizedAccessType,
      },
    });
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
