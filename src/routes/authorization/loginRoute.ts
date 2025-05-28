import { loginUser } from "../../controllers/authorization/loginController";
import express from "express";

const router = express.Router();

// POST-запрос на регистрацию пользователя
router.post("/login", loginUser);

export default router;
