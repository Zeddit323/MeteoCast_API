import "dotenv/config";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { User } from "../models/index.js";

const protect = async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
         throw new ApiError("Not logged in.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await User.findByPk(decoded.id);

    if(!currentUser){
        throw new ApiError("No user found with this id.", 404);
    }

    req.user = currentUser;

    next();
};

export default protect;