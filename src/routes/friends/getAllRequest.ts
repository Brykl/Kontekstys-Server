
import express from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { getFriendsHandler } from '../../controllers/friends/getAllFriends';
import { getFriendRequests } from '../../controllers/friends/getAllRequest';

const router = express.Router();

// Получение всех друзей авторизованного пользователя
router.get('/friends/request/all', verifyToken, getFriendRequests);

export default router;
