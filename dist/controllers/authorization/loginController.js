"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const JWT_SECRET = config_1.default.secretToken;
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Введите имя пользователя и пароль" });
        }
        // Берём из БД все нужные поля, включая icon_url
        const userResult = await dataBase_1.default.query(`SELECT id, user_name, email, role, status, icon_url
       FROM users WHERE user_name = $1`, [username]);
        if (userResult.rows.length === 0) {
            return res
                .status(401)
                .json({ message: "Неверное имя пользователя или пароль" });
        }
        const user = userResult.rows[0];
        // Проверяем хеш пароля
        const passwordHashResult = await dataBase_1.default.query("SELECT password_hash FROM users WHERE user_name = $1", [username]);
        const passwordHash = passwordHashResult.rows[0].password_hash;
        const isPasswordValid = await bcrypt_1.default.compare(password, passwordHash);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Неверное имя пользователя или пароль" });
        }
        if (user.status == false) {
            return res
                .status(400)
                .json({ message: "Пользователь заблокирвоан" });
        }
        // Формируем JWT, можно добавить icon_url в пейлоад, если нужно
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            role: user.role,
            icon_url: user.icon_url, // <-- добавлено
        }, JWT_SECRET, { expiresIn: "2h" });
        // Отдаём клиенту все нужные поля
        return res.status(200).json({
            message: "Успешный вход",
            token,
            user: {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                role: user.role,
                status: user.status,
                icon_url: user.icon_url, // <-- добавлено
            },
        });
    }
    catch (error) {
        console.error("Ошибка при входе:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.loginUser = loginUser;
