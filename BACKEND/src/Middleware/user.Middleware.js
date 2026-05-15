import dotenv from "dotenv/config";
import jwt from 'jsonwebtoken';
import { client } from '../../config/db.js';

export const authMiddleware = async (req, res, next) => {
    req.user = req.session?.user || null;
    next();
} 