"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const removeFriend_1 = require("../../controllers/friends/removeFriend");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/friends/remove', authMiddleware_1.verifyToken, removeFriend_1.removeFriend);
exports.default = router;
