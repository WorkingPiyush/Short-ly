import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { client } from '../../../config/db.js';

export const registerUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Missing email or password");
    }

    email = email.toLowerCase().trim();

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }

    if (password.length < 8) {
        throw new Error("Password length must be 8.")
    }

    const userId = crypto.randomUUID();
    try {
        const hashedPassword = await bcrypt.hash(password, 14);
        const result = await client.query(`INSERT INTO users (id,email, password) VALUES ($1, $2,$3) RETURNING id, email`, [userId, email, hashedPassword]);
        return result.rows[0];

    } catch (err) {
        if (err.code === '23505') {
            throw new Error("Registration failed !!");
        }
        throw err;
    }
}
export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Missing email or password");
    }
    email = email.toLowerCase().trim();

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }

    try {
        const result = await client.query(`SELECT id,email,password FROM users WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            throw new Error('Invalid Email or Password');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid Email or Password');
        }
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWTSECRET, { expiresIn: '7d' });
        return token;
    } catch (err) {
        console.log(err.message);
        throw new Error('Login failed');
    }
}