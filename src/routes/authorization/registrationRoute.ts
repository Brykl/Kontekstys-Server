import express from "express";
import { registerUser } from "../../controllers/authorization/registrationController";

const router = express.Router();

// POST-запрос на регистрацию пользователя
router.post("/register", registerUser);

export default router;
