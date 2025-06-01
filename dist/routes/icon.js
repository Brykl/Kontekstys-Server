"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const iconController_1 = require("../controllers/profile/iconController");
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, "../../public/icons");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Конфигурация Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const filename = file.fieldname + "-" + uniqueSuffix + ext;
        console.log("Saving icon:", filename);
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
// 🔒 POST /api/icon — Загрузка иконки
router.post("/icon", authMiddleware_1.verifyToken, upload.single("icon"), iconController_1.uploadIcon);
exports.default = router;
