import express from 'express';
import { shortUrl, getAllUrls, getUrl, deleteUrl } from './controller.js';
const router = express();

router.post('/short', shortUrl);
router.get('/myUrl', getAllUrls);
router.get('/:shortCode', getUrl);
router.delete('/:shortCode', deleteUrl);


export default router;