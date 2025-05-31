import express from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { getFriendsHandler } from '../../controllers/friends/getAllFriends';

const router = express.Router();

// Получение всех друзей авторизованного пользователя
router.get('/friends/all', verifyToken, getFriendsHandler);

export default router;
