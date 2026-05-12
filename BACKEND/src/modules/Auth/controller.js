import { ZodError } from "zod";
import { loginSchema, signupSchema } from "../../validator/auth.validator.js";
import * as authService from "./service.js";

export const register = async (req, res) => {
    const validatedBody = signupSchema.parse(req.body);
    try {
        const user = await authService.registerUser(validatedBody);
        req.session.user = {
            id: user.id,
            name: user.user,
        }

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Session save error",
                });
            }
        })
        return res.status(200).json({
            success: true,
            message: "Signup successfully",
            user: req.session.user,
        });
    } catch (err) {
        console.log(err.message)
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: err.errors,
            });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
}
export const login = async (req, res) => {
    const validatedBody = loginSchema.parse(req.body);
    try {
        const user = await authService.loginUser(validatedBody);

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Session error",
                });
            }
            req.session.user = {
                id: user.id,
                name: user.name,
            };

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Session save error",
                    });
                }
            })
            return res.status(200).json({
                success: true,
                message: "User logged successfully",
                user: req.session.user,
            });
        })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
}
export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Logout failed",
                })
            }
        })
        res.clearCookie("connect.sid");
        res.json({
            message: "Logout successfully",
        })
    } catch (error) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
}