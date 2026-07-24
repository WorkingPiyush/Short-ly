import express from "express";
import { login, register, logout, user, userDetails, updateProfile, forgetPassword, checkPassword, refreshToken, GoogleOAuth, GoogleOAuthcCb } from "./controller.js";
import { imageUpload } from "../../Middleware/upload.Middleware.js";
import { routeProtection } from "../../Middleware/protected.url.Middleware.js";
import passport from "passport";
import { getMeLimiter, loginLimiter, signupLimiter, updateLimiter } from "../../Middleware/ip.Middleware.js";

const router = express.Router();


router.post('/signup', signupLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', routeProtection, logout);

router.get("/google", GoogleOAuth);
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }), GoogleOAuthcCb)

router.get('/me', getMeLimiter, routeProtection, user);
router.get("/getMe", getMeLimiter, routeProtection, userDetails)
router.put('/update', updateLimiter, routeProtection, imageUpload.single("image"), updateProfile);
router.post('/reset-password', forgetPassword);
router.post('/match-password', checkPassword);

export default router;