"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const sendFriendRequest_1 = require("../../controllers/friends/sendFriendRequest");
const router = express_1.default.Router();
router.post("/friends/request", authMiddleware_1.verifyToken, sendFriendRequest_1.sendFriendRequest);
exports.default = router;
