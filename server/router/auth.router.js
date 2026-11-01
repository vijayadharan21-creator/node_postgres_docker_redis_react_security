import express from 'express';
import { userValidation } from '../validation/user.validation.js';
import validationUserMiddleware from '../middleware/validation.middleware.js';
import { registerUser, loginUser, refreshAccessToken } from '../controllers/login.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/limiter.middleware.js';
const router = express.Router();

router.post('/register', authLimiter, validationUserMiddleware(userValidation), registerUser);
router.post('/login', authLimiter, validationUserMiddleware(userValidation), loginUser);
router.post('/refresh', refreshAccessToken);

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export default router;
