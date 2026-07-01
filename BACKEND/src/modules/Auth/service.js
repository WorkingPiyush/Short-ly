import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError.js';
import logger from '../../../config/logger.js';
import { passwordCompare, passwordHashing } from '../../helper/Url.helper.js';
import { findUser, stats, userDetails } from '../../helper/Db.query.js';
import cloudinary from '../../../config/cloudinary.js';
import uploadImages from '../../helper/fileUpload.js';

export const getUser = async ({ userId }) => {
    const user = await client.user.findUnique({
        where: { id: userId },
        select: {
            role: true,
            profileImage: true,
            plan: true,
            phone: true,
            location: true,
            lastLoginAt: true,
            id: true,
            headline: true,
            createdAt: true,
            email: true,
            bio: true,
            address: true,
            name: true
        }
    })
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return { ...user, username: user.name };
}

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
}

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
}

export const registerUser = async ({ name, email, password }) => {
    try {
        const hashedPassword = await passwordHashing(password, 10)
        const user = await client.user.create({
            data: {
                name: name,
                email,
                password: hashedPassword
            }
        })

        logger.info({ id: user.id, name: user.name, email: user.email }, 'User registered');
        return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new AppError("Email already exists", 400);
        }
        throw new AppError("Registration failed", 500);
        logger.error("Registration failed");
    }
}

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
        void client.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        }).catch((err) => {
            console.error("Failed to update last login:", err);
        });
        return { id: user.id, name: user.name, email: user.email };
        logger.info({ id: user.id, name: user.name, email: user.email }, 'User logged');
    } catch (err) {
        logger.error(err.message)
        throw new AppError("Login Failure", 500);
    }
}