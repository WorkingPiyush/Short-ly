import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError.js';
import logger from '../../../config/logger.js';
import { passwordCompare, passwordHashing, tokenAccess, tokenRefresh } from '../../helper/Url.helper.js';
import { createUser, findUser, stats, userDetails } from '../../helper/Db.query.js';
import cloudinary from '../../../config/cloudinary.js';
import uploadImages from '../../helper/fileUpload.js';
import { sendEmail } from '../../service/mail.service.js';
import { checkEmailLimiter } from '../../Middleware/ip.Middleware.js';
import { redisClient } from '../../../config/redisClient.js';
const RESET_TOKEN_EXPIRY_MINUTES = Number(process.env.RESET_TOKEN_EXPIRY_MINUTES);


export const getUser = async ({ userId }) => {
    const data = await redisClient.get(`user:${userId}`);
    if (data) {
        let res = JSON.parse(data);
        return res;
    };
    const user = await findUser(userId);
    await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: 1200 });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

export const userInfo = async ({ userId }) => {
    const user = await userDetails(userId);
    const Urlstats = await stats(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return {
        name: user?.name,
        profileImage: user?.profileImage,
        headline: user?.headline,
        role: user?.role,
        location: user?.location,
        bio: user?.bio,
        phone: user?.phone,
        email: user?.email,
        address: user?.address,
        memberSince: user?.createdAt,
        plan: user?.plan,
        lastActive: user?.lastLoginAt,
        totalAvailableLinks: user.plan === "FREE" ? 50 : 1000,
        url: Urlstats,
    };
};

export const update = async ({ userId, data, file }) => {
    const user = await findUser(userId);
    let inputData = { ...data };

    if (file) {
        const uploaded = await uploadImages(file);
        inputData.profileImage = uploaded.secure_url;
    }
    const updatedUser = await client.user.update({
        where: { id: user.id },
        data: inputData,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            role: true,
            headline: true,
            location: true,
            bio: true,
            location: true,
            plan: true,
            createdAt: true,
            isVerified: true,
            address: true,
        }
    })
    return updatedUser;
};

export const registerUser = async ({ name, email, password }) => {
    try {
        const hashedPassword = await passwordHashing(password, 10);
        const user = await createUser(name, email, hashedPassword);

        const accessToken = tokenAccess(user.id);
        const refreshToken = tokenRefresh(user.id);
        const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await client.refreshToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                )
            }
        });
        logger.info({ id: user.id, name: user.name, email: user.email }, 'User registered');
        return { id: user.id, name: user.name, email: user.email, accessToken, refreshToken };
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new AppError("Email already exists", 400);
        }
        throw new AppError("Registration failed", 500);
        logger.error("Registration failed");
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const user = await client.user.findUnique({
            where: { email },
        })
        if (!user) {
            throw new AppError("Invalid Email", 401);
        }
        const isMatch = await passwordCompare(password, user.password)
        if (!isMatch) {
            throw new AppError("Invalid Email or Password", 401);
        }
        const accessToken = tokenAccess(user.id);
        const refreshToken = tokenRefresh(user.id);
        const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await prisma.refreshToken.deleteMany({
            where: {
                userId: user.id
            }
        });
        await client.refreshToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                )
            }
        });
        void client.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        }).catch((err) => {
            console.error("Failed to update last login:", err);
        });
        logger.info({ id: user.id, name: user.name, email: user.email }, 'User logged');
        return { id: user.id, name: user.name, email: user.email, accessToken, refreshToken };
    } catch (err) {
        logger.error(err.message)
        throw new AppError("Login Failure", 500);
    }
};

export const logoutUser = async ({ refreshToken }) => {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    client.refreshToken.deleteMany({
        where: { tokenHash }
    });
}
export const refreshTkn = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Unauthorized", 401);
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!payload) {
        throw new AppError("Unauthorized", 401);
    }
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const existance = await client.refreshToken.findUnique({
        where: {
            tokenHash: hash,
        }
    })
    if (!existance) {
        throw new AppError("Unauthorized", 401);
    };
    await client.refreshToken.deleteMany({
        where: {
            tokenHash: hash,
        }
    });
    const newAccessToken = tokenAccess(payload.userId);
    const newRefreshToken = tokenRefresh(payload.userId);
    const tokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    await client.refreshToken.create({
        data: {
            tokenHash,
            userId: payload.userId,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        }
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };

}

export const resetPassword = async ({ email }) => {
    await checkEmailLimiter(email);
    try {
        const user = await client.user.findUnique({
            where: { email },
        });

        if (!user) {
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        await client.$transaction([
            client.resetPassword.deleteMany({
                where: {
                    userId: user.id,
                },
            }),
            client.resetPassword.create({
                data: {
                    tokenHash,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000)
                }
            })
        ]);

        const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // await sendEmail("mk3554299@gmail.com", "Password Reset", link);
        console.log(link)
        // await sendEmail(user.email, "Password Reset", link);
        logger.info({ userId: user.id, email: user.email, event: "PASSWORD_RESET_REQUEST" });
        return;
    } catch (error) {
        logger.error(error)
        throw new AppError("Unable to process password reset", 500);
    }
};
export const paswordSubmit = async ({ password, token }) => {
    if (!password || !token) {
        throw new AppError("Token or password missing");
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const exitingToken = await client.resetPassword.findFirst({
        where: {
            tokenHash,
            expiresAt: {
                gt: new Date()
            },
        },
    });

    if (!exitingToken) {
        throw new AppError("Invalid or expired token", 400);
    };

    const hashedPassword = await passwordHashing(password, 10);
    await client.$transaction([
        client.user.update({
            where: {
                id: exitingToken.userId
            },
            data: {
                password: hashedPassword
            }
        }),
        client.resetPassword.deleteMany({
            where: {
                userId: exitingToken.userId,
            },
        })
    ])

};