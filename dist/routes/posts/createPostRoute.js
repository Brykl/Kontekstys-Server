"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/posts.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const createPostController_1 = require("../../controllers/posts/createPostController");
const router = express_1.default.Router();
// 1) Абсолютный путь к папке uploads (из корня Server/uploads)
const uploadDir = path_1.default.resolve(__dirname, "../../../uploads");
// 2) Создаём папку, если её нет
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// 3) Настраиваем multer с этим абсолютным путём
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const filename = `image-${uniqueSuffix}${ext}`;
        console.log("Saving file:", filename, "to", uploadDir);
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
// 4) Роут «/api/posts/create» принимает токен и одно поле «image»
router.post("/posts/create", authMiddleware_1.verifyToken, upload.single("image"), createPostController_1.createPost);
exports.default = router;
