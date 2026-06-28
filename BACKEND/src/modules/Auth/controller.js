import { success, ZodError } from "zod";
import { loginSchema, profileUpdateSchema, signupSchema } from "../../validator/auth.validator.js";
import * as authService from "./service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";

export const user = asyncHandler(async (req, res) => {
    const userInfo = await authService.getUser({
        userId: req.user.id
    })
    return res.status(200).json({
        success: true,
        user: userInfo,
    });
})
export const userDetails = asyncHandler(async (req, res) => {
    const userInfo = await authService.userInfo({
        userId: req.user.id
    })
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
    req.session.user = {
        id: user.id,
        username: user.name,
        email: user.email,
    }

    req.session.save((err) => {
        if (err) {
            throw new AppError("Session save error", 500);
        }

        res.clearCookie("tempId");

        return res.status(200).json({
            success: true,
            message: "Signup successfully",
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
            },
        });
    });
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
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Session error",
                });
            }
            req.session.user = {
                id: user.id,
                username: user.name,
                email: user.email,
            }
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Session save error",
                    });
                }
                return res.status(200).json({
                    success: true,
                    user: {
                        id: user.id,
                        username: user.name,
                        email: user.email,
                    }
                });
            })
            res.clearCookie("tempId");
        })
        logger.info(user, "User logged success !!")
    } catch (err) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
});

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
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed",
            })
        }
    })
    res.clearCookie("sid");
    res.json({
        success: true,
    })
});

