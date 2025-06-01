"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleteUserById_1 = require("../../controllers/admin/deleteUserById");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const getAllUsers_1 = require("../../controllers/admin/getAllUsers");
const toggleBlockUser_1 = require("../../controllers/admin/toggleBlockUser");
const router = express_1.default.Router();
// Все маршруты защищены авторизацией и требуют роль admin
router.use(authMiddleware_1.verifyToken);
router.get("/users", getAllUsers_1.getAllUsers);
router.delete("/users/:userId", deleteUserById_1.deleteUserById);
router.patch("/users/:userId/:action", toggleBlockUser_1.toggleBlockUser);
exports.default = router;
