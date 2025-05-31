import express from 'express';
import { removeFriend } from '../../controllers/friends/removeFriend';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/friends/remove', verifyToken, removeFriend);

export default router;
