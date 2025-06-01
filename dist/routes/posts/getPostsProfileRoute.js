"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getAvailablePostForProfiles_1 = require("../../controllers/posts/getAvailablePostForProfiles");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/posts/:username", authMiddleware_1.verifyToken, getAvailablePostForProfiles_1.getAvailablePostsForProfile);
exports.default = router;
