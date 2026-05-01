import 'dotenv/config';
import { Client } from 'pg';

export const client = new Client({
    host: 'localhost',
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
});

client.connect((err) => {
    if (err) {
        console.log("New Error: ", err)
    } else {
        console.log("Database Connected !!")
    }
})
