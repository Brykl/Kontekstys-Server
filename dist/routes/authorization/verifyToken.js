"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/verify", authMiddleware_1.verifyToken, (req, res) => {
    res.json({
        message: "Вы успешно авторизованы",
        user: req.user, // Только безопасные данные
    });
});
exports.default = router;
