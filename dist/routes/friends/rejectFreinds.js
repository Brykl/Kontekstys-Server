"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const rejectFriemsRequeest_1 = require("../../controllers/friends/rejectFriemsRequeest");
const router = express_1.default.Router();
// Отклонить заявку в друзья
router.post("/friends/reject", authMiddleware_1.verifyToken, rejectFriemsRequeest_1.rejectFriendRequest);
exports.default = router;
