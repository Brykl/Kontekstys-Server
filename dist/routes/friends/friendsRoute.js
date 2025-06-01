"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const findFriendsController_1 = require("../../controllers/friends/findFriendsController");
const router = express_1.default.Router();
// Обязательно именно GET, чтобы совпадало с клиентским запросом
router.get("/friends/find", authMiddleware_1.verifyToken, findFriendsController_1.searchUsersHandler);
exports.default = router;
