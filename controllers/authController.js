import "dotenv/config";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import crypto from "crypto";
import { Op } from "sequelize";
import { sendAccountDeletionConfirmation, sendPasswordResetConfirmationEmail, sendPasswordResetEmail } from "../utils/email.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

export const register = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({where: {email: email}});
    if(existingUser){
        throw new ApiError("Email already in use.", 409);
    }

    const user = await User.create({
        email: email,
        password_hash: password
    });

    res.status(201).json({
        status: "success",
        message: "User registered successfully.",
        userId: user.id
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.scope("withPassword")
        .findOne({ where: { email: email } });
    if (!existingUser) {
        throw new ApiError("Incorrect email or password.", 401);
    }
    const isMatch = await existingUser.correctPassword(password, existingUser.password_hash);

    if (!isMatch) {
        throw new ApiError("Incorrect email or password.", 401);
    }

    const token = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    };

    res.cookie('jwt', token, cookieOptions);

    existingUser.last_login = new Date();
    await existingUser.save();

    res.status(200).json({
        status: "success",
        message: "Logged in successfully!"
    });
};


export const logout = async (req, res) => {
    res.clearCookie('jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Lax"
    });

    res.status(200).json({
        status: "success",
        message: "Logget out successfully!"
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({
        where: { email: email }
    });

    if (!existingUser) {
        return res.status(200).json({
            status: "success",
            message: "Reset link sent."
        })
    }

    const resetToken = crypto.randomBytes(32)
        .toString('hex');
    const hashedToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    await existingUser.update({
        reset_password_token: hashedToken,
        reset_password_expires: new Date(Date.now() + 15 * 60 * 1000)
    });

    const resetLink = `${FRONTEND_URL}/auth/reset-password/${resetToken}`;

    console.log(resetLink);

    try {
        await sendPasswordResetEmail(email, resetLink);
    } catch (error) {
        await existingUser.update({
            reset_password_token: null,
            reset_password_expires: null,
        });

        throw new ApiError("There was an error sending the email. Please try again later.", 500);
    }
    

    res.status(200).json({
        status: "success",
        message: "Reset link sent"
    });
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256')
        .update(token)
        .digest('hex');

    const existingUser = await User.scope('withPassword').findOne({
        where: {
            reset_password_token: hashedToken,
            reset_password_expires: { [Op.gt]: new Date() }
        }
    });

    if (!existingUser) {
        throw new ApiError("Token is invalid or expired.", 401);
    }

    existingUser.password_hash = password;
    existingUser.reset_password_token = null;
    existingUser.reset_password_expires = null;

    await existingUser.save();

    await sendPasswordResetConfirmationEmail(existingUser.email);
    
    res.status(200).json({
        status: "success",
        message: "Password reset successful!"
    });
};

export const deleteAccount = async (req, res) => {
    const userToDelete = req.user;

    if(!userToDelete){
        throw new ApiError("No user found to delete.", 404);
    }

    try{
        await sendAccountDeletionConfirmation(req.user.email);
    }
    catch(error){
        throw new ApiError("There was an error sending the email. The account was not deleted. Please try again later.", 500);
    }

    await userToDelete.destroy();

    res.clearCookie('jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Lax"
    });

    

    res.status(200).json({
        status: "success",
        message: "Account deleted successfully."
    });
};