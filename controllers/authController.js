import "dotenv/config";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.create({
        email: email,
        password_hash: password
    });

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        userId: user.id
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.scope("withPassword")
                                .findOne({ where: { email: email } });
    if(!existingUser) {
        throw new ApiError("Incorrect email or password", 401);
    }
    const isMatch = await existingUser.correctPassword(password, existingUser.password_hash);

    if (!isMatch) {
        throw new ApiError("Incorrect email or password", 401);
    }

    const token = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );
    
    existingUser.last_login = new Date();
    await existingUser.save();

    res.status(200).json({
        status: "success",
        token,
        user: { id: existingUser.id, email: existingUser.email }
    });
};