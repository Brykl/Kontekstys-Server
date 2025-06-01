"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const acceptFriendRequest_1 = require("../../controllers/friends/acceptFriendRequest");
const router = express_1.default.Router();
router.post("/friends/accept", authMiddleware_1.verifyToken, acceptFriendRequest_1.acceptFriendRequest);
exports.default = router;
