import express from "express";
import { register, login, forgotPassword, resetPassword, logout, deleteAccount } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.post('/logout', protect, logout);
router.delete('/delete-account', protect, deleteAccount);

export default router;