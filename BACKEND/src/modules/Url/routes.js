import express from 'express';
import { redirectUrl, shortUrl } from './controller.js';
const router = express();

router.post('/short', shortUrl)
router.get('/:shortCode', redirectUrl)


export default router;