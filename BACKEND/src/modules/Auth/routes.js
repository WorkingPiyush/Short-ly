import express from "express";
import { login, register, logout, user, userDetails, updateProfile, forgetPassword, checkPassword, refreshToken, GoogleOAuth, GoogleOAuthcCb } from "./controller.js";
import { imageUpload } from "../../Middleware/upload.Middleware.js";
import { routeProtection } from "../../Middleware/protected.url.Middleware.js";
import { forgotPasswordIpLimiter } from "../../Middleware/ip.Middleware.js";
import passport from "passport";
import rateLimit from 'express-rate-limit';

const router = express.Router();
const baseUrl = process.env.NODE_ENV === "production" ? process.env.PROD_FRONTEND_URL : process.env.FRONTEND_URL;

const Ratelimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
})

router.post('/signup', Ratelimit, register);
router.post('/login', Ratelimit, login);
router.post('/refresh', refreshToken);
router.post('/logout', routeProtection, logout);

router.get("/google", GoogleOAuth);
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${baseUrl}/login` }), GoogleOAuthcCb)

router.get('/me', routeProtection, user);
router.get("/getMe", routeProtection, userDetails)
router.put('/update', routeProtection, Ratelimit, imageUpload.single("image"), updateProfile);
router.post('/reset-password', forgotPasswordIpLimiter, forgetPassword);
router.post('/match-password', checkPassword);

export default router;