"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/postRoutes.ts
const express_1 = __importDefault(require("express"));
const deletePostsController_1 = require("../../controllers/posts/deletePostsController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.delete("/posts/:id", authMiddleware_1.verifyToken, deletePostsController_1.deletePostById);
exports.default = router;
