import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middlewares/authMiddleware";
import { uploadIcon } from "../controllers/profile/iconController";

const router = express.Router();

const uploadDir = path.join(__dirname, "../../public/icons");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Конфигурация Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + uniqueSuffix + ext;
    console.log("Saving icon:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// 🔒 POST /api/icon — Загрузка иконки
router.post("/icon", verifyToken, upload.single("icon"), uploadIcon);

export default router;
