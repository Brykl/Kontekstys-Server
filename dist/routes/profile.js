"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Приватный маршрут
router.get("/profile", authMiddleware_1.verifyToken, (req, res) => {
    res.json({ message: "Добро пожаловать в профиль", user: req.user });
});
exports.default = router;
