import express from "express";
import {
  deleteUserById
} from "../../controllers/admin/deleteUserById";
import { verifyToken } from "../../middlewares/authMiddleware";
import { getAllUsers } from "../../controllers/admin/getAllUsers";
import { toggleBlockUser } from "../../controllers/admin/toggleBlockUser";

const router = express.Router();

// Все маршруты защищены авторизацией и требуют роль admin
router.use(verifyToken);

router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUserById);
router.patch("/users/:userId/:action", toggleBlockUser);

export default router;
