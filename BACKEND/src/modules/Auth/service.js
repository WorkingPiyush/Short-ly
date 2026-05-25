import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError.js';
import logger from '../../../config/logger.js';
import { passwordCompare, passwordHashing } from '../../helper/Url.helper.js';


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
        return { id: user.id, name: user.name, email: user.email };
        logger.info({ id: user.id, name: user.name, email: user.email }, 'User logged');
    } catch (err) {
        logger.error(err.message)
        throw new AppError("Login Failure", 500);
    }
}