import pool from "../../config/dataBase";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR user_name = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (user_name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_name, email`,
      [username, email, hashedPassword]
    );

    const newUserId = newUser.rows[0].id;

    // 💡 Вставляем пользователя в таблицу user_friends
    await pool.query(
      `INSERT INTO user_friends (user_id) VALUES ($1)`,
      [newUserId]
    );

    return res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: newUser.rows[0],
    });
  } catch (error: unknown) {
    console.error("Ошибка при регистрации:", error);

    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Внутренняя ошибка сервера", error: error.message });
    } else {
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
};
