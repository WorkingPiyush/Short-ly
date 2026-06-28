import express from "express";
import { login, register, logout, user, userDetails, updateProfile } from "./controller.js";
import { imageUpload } from "../../Middleware/upload.Middleware.js";
import { routeProtection } from "../../Middleware/protected.url.Middleware.js";
const router = express.Router();

router.get('/me', user);
router.get("/getMe", userDetails)
router.post('/signup', register);
router.post('/login', login);
router.put('/update', routeProtection, imageUpload.single("image"), updateProfile)
router.post('/logout', logout);

export default router;