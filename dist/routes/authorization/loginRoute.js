"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = require("../../controllers/authorization/loginController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// POST-запрос на регистрацию пользователя
router.post("/login", loginController_1.loginUser);
exports.default = router;
