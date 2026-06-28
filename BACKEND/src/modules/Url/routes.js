import express from 'express';
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl, searchUrl, getUrlAnalytics, Analytics } from './controller.js';
import { routeProtection } from '../../Middleware/protected.url.Middleware.js';
import { excelUpload } from '../../Middleware/upload.Middleware.js';
const router = express();

router.post('/short', shortUrl); // short url creation
router.post('/:shortCode/verify-password', verifyPassword) // password verification
router.post("/bulk", routeProtection, excelUpload.single("file"), bulkShortUrl) // bulk file url shortening 

router.get('/', routeProtection, getAllUrls); // getting users all urls
router.get('/analytics', routeProtection, Analytics); // getting info about a specific short url 
router.get('/:shortCode/analytics', routeProtection, getUrlAnalytics); // getting analytics about a specific short url 
router.get('/search/:query', routeProtection, searchUrl); // getting info about a specific short url 
router.get('/:shortCode', routeProtection, getUrl); // getting info about a specific short url 

router.delete('/:shortCode', routeProtection, deleteUrl); // deleting the a specific short url 
router.patch('/:shortCode', routeProtection, updateUrl) // updating the a specific short url




export default router;