import dotenv from "dotenv/config";
import { client } from "../config/db.js";
import authRoutes from './modules/Auth/routes.js';
import urlRoutes from './modules/Url/routes.js';
import session from 'express-session';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { RedisStore } from 'connect-redis';
import { redisClient } from "../config/redisClient.js";
import { guestUserInfo } from "./Middleware/guest.Middleware.js";
import { authMiddleware } from "./Middleware/user.Middleware.js";
import { redirectUrl } from "./modules/Url/controller.js";
import errorHandler from "./Middleware/errorHandler.js";
import logger from "../config/logger.js";


const authRatelimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
})

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(cookieParser());
app.use(guestUserInfo);
app.use(authMiddleware);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Server is Working');
    logger.info('Server is Working');
});






// Authentication route
// app.use("/api/auth", authRatelimit, authRoutes);
app.use("/api/auth", authRoutes);
// Url route
app.use("/api/url/", urlRoutes);
// Url redirection route
app.get("/:shortCode", redirectUrl); // redirecting the short url to orgional url
app.use(errorHandler);



export default app;