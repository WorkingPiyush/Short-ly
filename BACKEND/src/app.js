import dotenv from "dotenv";
dotenv.config();
import { client } from "../config/db.js";
import authRoutes from './modules/Auth/routes.js';
import urlRoutes from './modules/Url/routes.js';
import session from 'express-session';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const authRatelimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
})

const app = express();
app.use(express.json());
app.use(helmet());

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


app.get('/', (req, res) => { res.send('Server is Working'); })









// Authentication route
app.use("/api/auth", authRatelimit, authRoutes);
app.use("/api/url", urlRoutes);




export default app;