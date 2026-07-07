import { CodingChallenge } from '../models/CodingChallenge.js';
import { Submission } from '../models/Submission.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getChallenges = async (req, res, next) => {
  try {
    const filter = { status: 'published' };
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.topic) filter.topic = req.query.topic;

    const challenges = await CodingChallenge.find(filter).sort('difficulty');

    res.status(200).json({
      status: 'success',
      results: challenges.length,
      data: { challenges }
    });
  } catch (error) {
    next(error);
  }
};

export const submitChallengeCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return next(new AppError('Please provide the solution code', 400));
    }
    if (!language) {
      return next(new AppError('Please specify the programming language', 400));
    }

    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) {
      return next(new AppError('Coding challenge not found', 404));
    }

    // 1. Simulate compiler execution metrics
    let status = 'accepted';
    let runtimeMs = Math.floor(Math.random() * 60) + 12;
    let memoryMb = (Math.random() * 15 + 10).toFixed(2);

    // Basic validation check
    const normalizedCode = code.replace(/\s+/g, '');
    if (normalizedCode.length < 15) {
      status = 'rejected';
    }

    // 2. Save submission inside MongoDB
    const submission = await Submission.create({
      user: req.user._id,
      challenge: challenge._id,
      code,
      language,
      status,
      runtimeMs,
      memoryMb
    });

    res.status(201).json({
      status: 'success',
      data: { submission }
    });
  } catch (error) {
    logger.error('Failed to register submission code:', error);
    next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('challenge', 'title difficulty topic points')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: submissions.length,
      data: { submissions }
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    // Aggregation query: group accepted challenges by user and count solved
    const leaderboard = await Submission.aggregate([
      { $match: { status: 'accepted' } },
      {
        $group: {
          _id: '$user',
          solvedCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          solvedCount: 1,
          totalPoints: { $multiply: ['$solvedCount', 100] }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { leaderboard }
    });
  } catch (error) {
    next(error);
  }
};
