import express from 'express';
import { shortUrl } from './controller.js';
const router = express();

router.post('/short', shortUrl)


export default router;