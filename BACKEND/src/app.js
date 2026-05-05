import express from 'express';
const app = express();
app.use(express.json());
import { client } from "../config/db.js";


app.get('/', (req, res) => { res.send('Server is Working'); })

// Authentication routes
import authRoutes from './modules/Auth/routes.js'
app.use("/api/auth", authRoutes);




export default app;