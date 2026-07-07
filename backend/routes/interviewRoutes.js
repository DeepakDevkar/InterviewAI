import express from 'express';
import { createInterview, getInterviews, getInterviewById, submitInterviewAnswers } from '../controllers/interviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkInterviewLimit } from '../middlewares/limitMiddleware.js';

const router = express.Router();

// All interview routes are protected
router.use(protect);

router.route('/')
  .post(checkInterviewLimit, createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterviewById)
  .post(submitInterviewAnswers);

export default router;
