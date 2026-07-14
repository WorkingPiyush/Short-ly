import dotenv from "dotenv/config";
import jwt from 'jsonwebtoken';

export const routeProtection = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "UnAuthorised" });
    }
    next();
};