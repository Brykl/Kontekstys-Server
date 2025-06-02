import path from "path";
import fs from "fs";
import multer from "multer";
import * as tf from "@tensorflow/tfjs-node";
import * as nsfw from "nsfwjs";
import sharp from "sharp";

const tempDir = path.join(__dirname, "../../temp");
const uploadDir = path.join(__dirname, "../../uploads");

// Создание директорий при необходимости
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Загрузка NSFW-модели
let model: nsfw.NSFWJS;
(async () => {
  model = await nsfw.load();
})();

// Механизм multer: сохраняем во временную папку
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + uniqueSuffix + ext;
    console.log("Saving temp file:", filename);
    cb(null, filename);
  },
});

export const uploadMiddleware = multer({ storage });

// Проверка и перемещение (выполняется после загрузки multer)
export const processUploadedImage = async (
  tempFilePath: string,
  finalFilename: string
) => {
  const imageBuffer = fs.readFileSync(tempFilePath);
  const imageTensor = tf.node.decodeImage(imageBuffer, 3);

  const predictions = await model.classify(imageTensor);
  imageTensor.dispose();

  const isNSFW = predictions.some(
    (p) =>
      (p.className === "Porn" ||
        p.className === "Hentai" ||
        p.className === "Sexy") &&
      p.probability > 0.7
  );

  const finalPath = path.join(uploadDir, finalFilename);

  if (isNSFW) {
    console.log("⚠️ NSFW detected. Replacing with blurred image.");

    await sharp(imageBuffer)
      .blur(100) // Очень сильное размытие
      .toFile(finalPath);
  } else {
    fs.renameSync(tempFilePath, finalPath);
  }

  // Удаление временного файла, если не перенесён
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  return { saved: true, nsfw: isNSFW, path: finalPath };
};
