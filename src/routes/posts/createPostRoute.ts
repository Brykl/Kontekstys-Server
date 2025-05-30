// src/routes/posts.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../../middlewares/authMiddleware";
import { createPost } from "../../controllers/posts/createPostController";

const router = express.Router();

// 1) Абсолютный путь к папке uploads (из корня Server/uploads)
const uploadDir = path.resolve(__dirname, "../../../uploads");

// 2) Создаём папку, если её нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3) Настраиваем multer с этим абсолютным путём
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `image-${uniqueSuffix}${ext}`;
    console.log("Saving file:", filename, "to", uploadDir);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// 4) Роут «/api/posts/create» принимает токен и одно поле «image»
router.post("/posts/create", verifyToken, upload.single("image"), createPost);

export default router;
