"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../../controllers/authorization/registrationController");
const router = express_1.default.Router();
// POST-запрос на регистрацию пользователя
router.post("/register", registrationController_1.registerUser);
exports.default = router;
