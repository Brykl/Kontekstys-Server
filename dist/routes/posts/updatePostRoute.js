"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const updatePostController_1 = require("../../controllers/posts/updatePostController");
const router = (0, express_1.Router)();
// Обновление поста (только автор имеет право)
router.patch("/posts/:id", authMiddleware_1.verifyToken, updatePostController_1.updatePost);
exports.default = router;
