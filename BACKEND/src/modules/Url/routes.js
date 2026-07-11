import express from 'express';
<<<<<<< HEAD
import rateLimit from 'express-rate-limit';
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl } from './controller.js';
=======
import { shortUrl, getAllUrls, getUrl, deleteUrl, updateUrl, verifyPassword, bulkShortUrl, searchUrl, getUrlAnalytics, Analytics, getAllCategoryUrls } from './controller.js';
>>>>>>> 328e4849ade5fa910baa7adcc0b4984ac314e0d8
import { routeProtection } from '../../Middleware/protected.url.Middleware.js';
import { excelUpload } from '../../Middleware/upload.Middleware.js';
const router = express();
const UrlRL = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 12,
});
const bulkUrlRL = shortUrlRL({
    windowMs: 60 * 60 * 1000,
    max: 10,
})

<<<<<<< HEAD
router.post('/short', UrlRL, shortUrl); // short url creation
router.post("/bulkShort", routeProtection, bulkUrlRL, upload.single("file"), bulkShortUrl) // bulk file url shortening 
=======
router.post('/short', shortUrl); // short url creation
router.post('/:shortCode/verify-password', verifyPassword) // password verification
router.post("/bulk", routeProtection, excelUpload.single("file"), bulkShortUrl) // bulk file url shortening 

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> b76499274c31f6f2047a4285d2b1350c154662ab
=======
>>>>>>> b76499274c31f6f2047a4285d2b1350c154662ab
router.get('/myUrl', routeProtection, getAllUrls); // getting users all urls
=======
router.get('/', routeProtection, getAllUrls); // getting users all urls
router.get('/category', routeProtection, getAllCategoryUrls); // getting users all urls
router.get('/analytics', routeProtection, Analytics); // getting info about a specific short url 
router.get('/:shortCode/analytics', routeProtection, getUrlAnalytics); // getting analytics about a specific short url 
router.get('/search/:query', routeProtection, searchUrl); // getting info about a specific short url 
>>>>>>> 328e4849ade5fa910baa7adcc0b4984ac314e0d8
router.get('/:shortCode', routeProtection, getUrl); // getting info about a specific short url 

router.delete('/:shortCode', routeProtection, deleteUrl); // deleting the a specific short url 
<<<<<<< HEAD
router.patch('/:shortCode', routeProtection, UrlRL, updateUrl) // updating the a specific short url
router.post('/verify-password/:shortCode', UrlRL, verifyPassword) // password verification
=======
router.patch('/:shortCode', routeProtection, updateUrl) // updating the a specific short url


<<<<<<< HEAD
>>>>>>> b76499274c31f6f2047a4285d2b1350c154662ab
=======
>>>>>>> b76499274c31f6f2047a4285d2b1350c154662ab


export default router;