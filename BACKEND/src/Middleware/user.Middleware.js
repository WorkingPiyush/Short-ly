import dotenv from "dotenv/config";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = {
            id: payload.userId
        };
    } catch (error) {
        console.log(error)
        req.user = null;
    }
    next();
};