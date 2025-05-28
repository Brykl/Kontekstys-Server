import express from "express";
import { registerUser } from "../controllers/registrationController";

const router = express.Router();

// POST-запрос на регистрацию пользователя
router.post("/register", registerUser);

export default router;
