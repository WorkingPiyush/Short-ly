import express from "express";
import { login, register, logout, user, userDetails } from "./controller.js";
const router = express.Router();

router.get('/me', user);
router.get("/getMe", userDetails)
router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;