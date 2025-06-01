"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const getAllRequest_1 = require("../../controllers/friends/getAllRequest");
const router = express_1.default.Router();
// Получение всех друзей авторизованного пользователя
router.get('/friends/request/all', authMiddleware_1.verifyToken, getAllRequest_1.getFriendRequests);
exports.default = router;
