import { email, ZodError } from "zod";
import { loginSchema, passwordSchema, profileUpdateSchema, signupSchema } from "../../validator/auth.validator.js";
import * as authService from "./service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";
import passport from 'passport';
import '../../../config/passport.auth.js';
import { tokenAccess, tokenRefresh } from "../../helper/Url.helper.js";
const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
};
const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};


export const user = asyncHandler(async (req, res) => {
    try {
        const userInfo = await authService.getUser({
            userId: req.user.id
        })
        return res.status(200).json({
            success: true,
            user: userInfo,
        });
    } catch (error) {
        throw new AppError("Server Error", 500);
    }
})
export const userDetails = asyncHandler(async (req, res) => {
    const userInfo = await authService.userInfo({
        userId: req.user.id
    });
    return res.status(200).json({
        success: true,
        user: userInfo,
    });
})
export const register = asyncHandler(async (req, res) => {
    const validatedBody = signupSchema.safeParse(req.body);
    if (!validatedBody.success) {
        let { message } = JSON.parse(validatedBody.error.message)[0];
        throw new AppError(message, 400);
    }
    const user = await authService.registerUser(validatedBody.data);
    res.cookie("accessToken", user.accessToken, accessTokenOptions);
    res.cookie("refreshToken", user.refreshToken, refreshTokenOptions);
    res.clearCookie("tempId");
    return res.json({ success: true, user: { userId: user.id, name: user.name, email: user.email } })
});

export const login = asyncHandler(async (req, res) => {
    const validatedBody = loginSchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(400).json({
            errors: validatedBody.error.flatten(),
        });
    }

    try {
        const user = await authService.loginUser(validatedBody.data);
        if (!user) {
            throw new AppError("User Not Found", 404);
        }
        res.cookie("accessToken", user.accessToken, accessTokenOptions);
        res.cookie("refreshToken", user.refreshToken, refreshTokenOptions);
        res.clearCookie("tempId");
        return res.json({ success: true, user: { userId: user.id, name: user.name, email: user.email } })
    } catch (err) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
});

export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        const user = await authService.refreshTkn(refreshToken);
        res.cookie("accessToken", user.accessToken, accessTokenOptions);
        res.cookie("refreshToken", user.refreshToken, refreshTokenOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error(error.message);
        throw new AppError("Server Error", 500);
    }
})

export const updateProfile = asyncHandler(async (req, res) => {
    const validatedBody = profileUpdateSchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(400).json({
            errors: validatedBody.error.flatten(),
        });
    };
    const user = await authService.update({
        userId: req.user.id,
        data: validatedBody.data,
        file: req.file,
    });

    return res.status(200).json({
        success: true,
        user: user,
    });
});

export const logout = asyncHandler(async (req, res) => {
    const user = await authService.logoutUser({
        refreshToken: req.cookies.refreshToken
    });

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.json({
        success: true,
    })
});

export const GoogleOAuth = passport.authenticate("google", { scope: ["profile", "email"], session: false });
export const GoogleOAuthcCb = (req, res) => {
    const user = req.user;
    const accessToken = tokenAccess(user.id);
    const refreshToken = tokenRefresh(user.id);
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    logger.info("User Loggedin using oAuth");
    res.clearCookie("tempId");
    res.redirect(process.env.FRONTEND_URL);
};

export const forgetPassword = asyncHandler(async (req, res) => {
    const userInfo = await authService.resetPassword({
        email: req.body?.email.toLowerCase()
    });
    return res.status(200).json({ success: true, userInfo });
});
export const checkPassword = asyncHandler(async (req, res) => {
    const validPassword = passwordSchema.safeParse(req.body?.password);
    if (!validPassword.success) {
        let { message } = JSON.parse(validPassword.error.message)[0];
        throw new AppError(message, 400);
    };

    const PasswordUpdate = await authService.paswordSubmit({
        password: validPassword.data,
        token: req.body.token
    });
    return res.status(200).json({ success: true });
});