import { Request, Response } from "express";
import pool from "../config/dataBase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET = config.secretToken;

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Введите имя пользователя и пароль" });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_name = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Успешный вход",
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
