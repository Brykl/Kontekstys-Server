"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const iconSender_1 = require("../../controllers/profile/iconSender");
const router = express_1.default.Router();
// 🔓 GET /api/icon/:username — получить icon_url по имени
router.get("/icon/:username", iconSender_1.getIconByUsername);
exports.default = router;
