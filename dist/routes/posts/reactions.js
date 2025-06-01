"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createReaction_1 = require("../../controllers/posts/createReaction");
const updateReaction_1 = require("../../controllers/posts/updateReaction");
const authMiddleware_1 = require("../../middlewares/authMiddleware"); //
const router = (0, express_1.Router)();
// Создать реакцию (лайк/дизлайк)
router.post("/create", authMiddleware_1.verifyToken, createReaction_1.createReaction);
// Обновить или удалить реакцию
router.put("/update", authMiddleware_1.verifyToken, updateReaction_1.updateReaction);
exports.default = router;
