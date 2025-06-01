"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getAllPostsController_1 = require("../../controllers/posts/getAllPostsController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/posts", authMiddleware_1.verifyToken, getAllPostsController_1.getAvailablePosts);
exports.default = router;
