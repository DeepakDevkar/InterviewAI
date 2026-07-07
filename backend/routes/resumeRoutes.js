import express from 'express';
import { analyzeResume } from '../controllers/resumeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { checkResumeLimit } from '../middlewares/limitMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', upload.single('resume'), checkResumeLimit, analyzeResume);

export default router;
