import express from 'express';
import rateLimit from 'express-rate-limit';
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl } from './controller.js';
import { routeProtection } from '../../Middleware/protected.url.Middleware.js';
import { upload } from '../../Middleware/upload.Middleware.js';
const router = express();
const UrlRL = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 12,
});
const bulkUrlRL = shortUrlRL({
    windowMs: 60 * 60 * 1000,
    max: 10,
})

router.post('/short', UrlRL, shortUrl); // short url creation
router.post("/bulkShort", routeProtection, bulkUrlRL, upload.single("file"), bulkShortUrl) // bulk file url shortening 
router.get('/myUrl', routeProtection, getAllUrls); // getting users all urls
router.get('/:shortCode', routeProtection, getUrl); // getting info about a specific short url 
router.delete('/:shortCode', routeProtection, deleteUrl); // deleting the a specific short url 
router.patch('/:shortCode', routeProtection, UrlRL, updateUrl) // updating the a specific short url
router.post('/verify-password/:shortCode', UrlRL, verifyPassword) // password verification


export default router;