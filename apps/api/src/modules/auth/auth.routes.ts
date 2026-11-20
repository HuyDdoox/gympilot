import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const authRoutes: Router = Router();

authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.post('/register', (req, res) => authController.register(req, res));
authRoutes.post('/refresh-token', (req, res) => authController.refreshToken(req, res));
authRoutes.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
authRoutes.post('/reset-password', (req, res) => authController.resetPassword(req, res));
authRoutes.post('/logout', (req, res) => authController.logout(req, res));
authRoutes.get('/me', authMiddleware, (req, res) => authController.getMe(req, res));
