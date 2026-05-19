import dotenv from "dotenv/config";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    req.user = req.session?.user || null;
    next();
} 