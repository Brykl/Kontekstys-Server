"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Заполните все поля" });
        }
        const existingUser = await dataBase_1.default.query("SELECT * FROM users WHERE email = $1 OR user_name = $2", [email, username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "Пользователь уже существует" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await dataBase_1.default.query(`INSERT INTO users (user_name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_name, email`, [username, email, hashedPassword]);
        const newUserId = newUser.rows[0].id;
        // 💡 Вставляем пользователя в таблицу user_friends
        await dataBase_1.default.query(`INSERT INTO user_friends (user_id) VALUES ($1)`, [newUserId]);
        return res.status(201).json({
            message: "Пользователь успешно зарегистрирован",
            user: newUser.rows[0],
        });
    }
    catch (error) {
        console.error("Ошибка при регистрации:", error);
        if (error instanceof Error) {
            return res
                .status(500)
                .json({ message: "Внутренняя ошибка сервера", error: error.message });
        }
        else {
            return res.status(500).json({ message: "Внутренняя ошибка сервера" });
        }
    }
};
exports.registerUser = registerUser;
