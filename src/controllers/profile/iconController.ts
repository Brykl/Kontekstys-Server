import { Request, Response } from "express";
import path from "path";
import pool from "../../config/dataBase";

// Расширяем тип Request, чтобы добавить поле user
interface AuthRequest extends Request {
  user?: {
    id: number;
    user_name: string;
  };
}

// 📥 Контроллер: сохраняет иконку и путь в БД
export const uploadIcon = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

    await pool.query("UPDATE users SET icon_url = $1 WHERE id = $2", [
      iconPath,
      userId,
    ]);

    res.status(200).json({ success: true, iconPath });
  } catch (error) {
    console.error("Ошибка при загрузке иконки:", error);
    res.status(500).json({ error: "Ошибка загрузки иконки" });
  }
};
