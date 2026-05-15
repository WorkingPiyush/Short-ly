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
import { guestUserInfo } from "./Middleware/guest.Middleware.js";
import { authMiddleware } from "./Middleware/user.Middleware.js";


const authRatelimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
})

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FONTEND_URL,
    credentials: true,
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
    },
}))

app.use(guestUserInfo);
app.use(authMiddleware);

app.get('/', (req, res) => { res.send('Server is Working'); })









// Authentication route
app.use("/api/auth", authRatelimit, authRoutes);
// Url route
app.use("/api/url", urlRoutes);
app.use("/", urlRoutes);




export default app;