import express from 'express';
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl } from './controller.js';
import { routeProtection } from '../../Middleware/protected.url.Middleware.js';
import { upload } from '../../Middleware/upload.Middleware.js';
const router = express();

router.post('/short', shortUrl); // short url creation
router.post('/verify-password/:shortCode', verifyPassword) // password verification
router.post("/bulkShort", routeProtection, upload.single("file"), bulkShortUrl) // bulk file url shortening 

router.get('/myUrl', routeProtection, getAllUrls); // getting users all urls
router.get('/:shortCode', routeProtection, getUrl); // getting info about a specific short url 

router.delete('/:shortCode', routeProtection, deleteUrl); // deleting the a specific short url 
router.patch('/:shortCode', routeProtection, updateUrl) // updating the a specific short url




export default router;