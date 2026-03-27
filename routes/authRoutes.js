import express from "express";
import { register, login, forgotPassword, resetPassword, logout, deleteAccount } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protect);
router.post('/logout', logout);
router.delete('/delete-account', deleteAccount);

export default router;