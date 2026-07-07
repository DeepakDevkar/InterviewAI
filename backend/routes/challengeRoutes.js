import express from 'express';
import { 
  getChallenges, 
  submitChallengeCode, 
  getSubmissionHistory, 
  getLeaderboard 
} from '../controllers/challengeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getChallenges);
router.get('/leaderboard', getLeaderboard);
router.get('/history', getSubmissionHistory);
router.post('/:id/submit', submitChallengeCode);

export default router;
