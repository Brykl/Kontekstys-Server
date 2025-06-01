"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const getAllFriends_1 = require("../../controllers/friends/getAllFriends");
const router = express_1.default.Router();
// Получение всех друзей авторизованного пользователя
router.get('/friends/all', authMiddleware_1.verifyToken, getAllFriends_1.getFriendsHandler);
exports.default = router;
