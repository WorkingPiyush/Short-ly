import express from 'express';
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl, searchUrl, getUrlAnalytics, Analytics, getAllCategoryUrls } from './controller.js';
import { routeProtection } from '../../Middleware/protected.url.Middleware.js';
import { excelUpload } from '../../Middleware/upload.Middleware.js';
import { allAnalyticsLimiter, allUrlLimiter, bulkUrlLimiter, urlAnalyticsLimiter, urlCreateLimiter, urlLimiter, urlUpdateLimiter } from '../../Middleware/ip.Middleware.js';
const router = express();

router.post('/short', urlCreateLimiter, shortUrl); // short url creation
router.post('/:shortCode/verify-password', verifyPassword) // password verification
router.post("/bulk", routeProtection, bulkUrlLimiter, excelUpload.single("file"), bulkShortUrl) // bulk file url shortening 

router.get('/', routeProtection, allUrlLimiter, getAllUrls); // getting users all urls
router.get('/category', routeProtection, getAllCategoryUrls); // getting users all urls
router.get('/analytics', allAnalyticsLimiter, routeProtection, Analytics); // getting info about a specific short url 
router.get('/:shortCode/analytics', urlAnalyticsLimiter, routeProtection, getUrlAnalytics); // getting analytics about a specific short url 
router.get('/search/:query', routeProtection, searchUrl); // getting info about a specific short url 
router.get('/:shortCode', routeProtection, urlLimiter, getUrl); // getting info about a specific short url 

router.delete('/:shortCode', routeProtection, deleteUrl); // deleting the a specific short url 
router.patch('/:shortCode', urlUpdateLimiter, routeProtection, updateUrl) // updating the a specific short url




export default router;