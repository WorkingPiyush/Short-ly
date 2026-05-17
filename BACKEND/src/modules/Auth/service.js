import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';
import { Prisma } from '@prisma/client';


export const registerUser = async ({ name, email, password }) => {

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
                name: name,
                email,
                password: hashedPassword
            }
        })
        return { id: user.id, name: user.name, email: user.email };

    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error('Email already exists');
            }
        }
        throw new Error('Something went wrong');
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const user = await client.user.findUnique({
            where: { email },
        })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid Email or Password');
        }
        return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
        console.log(err)
        throw new Error('Login failed');
    }
}