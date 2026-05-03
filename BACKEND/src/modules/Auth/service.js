import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';
import { Prisma } from '@prisma/client';

export const registerUser = async ({ name, email, password }) => {
    if (!email || !password) {
        throw new Error("Missing email or password");
    }
    email = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email');
    }

    if (name && name.length > 50) {
        throw new Error("Name is too long");
    }

    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!strongPassword.test(password)) {
        throw new Error("Weak password");
    }
    const existing = await client.user.findUnique({
        where: { email },
    })
    if (existing) {
        throw new Error("Email already exists");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await client.user.create({
            data: {
                name: name?.trim(),
                email,
                password: hashedPassword
            }
        })
        return user.id;

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error('Email already exists');
            }
        }
        throw new Error('Something went wrong');
    }
}

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Missing email or password");
    }

    email = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email');
    }

    try {
        const user = await client.user.findUnique({
            where: { email },
        })

        if (!user || !user.password) {
            throw new Error('Invalid Email or Password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid Email or Password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWTSECRET, { expiresIn: '7d' });
        return token;
    } catch (err) {
        console.log(err.message)
        throw new Error('Login failed');
    }
}