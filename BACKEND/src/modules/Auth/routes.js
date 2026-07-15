import express from "express";
import { login, register, logout, user, userDetails, updateProfile, forgetPassword, checkPassword, refreshToken } from "./controller.js";
import { imageUpload } from "../../Middleware/upload.Middleware.js";
import { routeProtection } from "../../Middleware/protected.url.Middleware.js";
import { forgotPasswordIpLimiter } from "../../Middleware/ip.Middleware.js";
const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', routeProtection, logout);

router.get('/me', routeProtection, user);
router.get("/getMe", routeProtection, userDetails)
router.put('/update', routeProtection, imageUpload.single("image"), updateProfile);
router.post('/reset-password', forgotPasswordIpLimiter, forgetPassword);
router.post('/match-password', checkPassword);

export default router;