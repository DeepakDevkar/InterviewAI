import { Interview } from '../models/Interview.js';
import { Feedback } from '../models/Feedback.js';
import { Resume } from '../models/Resume.js';
import { Submission } from '../models/Submission.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Total Interviews
    const totalInterviews = await Interview.countDocuments({ user: userId });

    // 2. Average Score
    const completedInterviews = await Interview.find({ user: userId, status: 'completed' });
    const completedIds = completedInterviews.map((i) => i._id);
    const feedbacks = await Feedback.find({ interview: { $in: completedIds } });
    
    let avgScore = 0;
    if (feedbacks.length > 0) {
      const total = feedbacks.reduce((acc, f) => acc + f.overallScore, 0);
      avgScore = Math.round(total / feedbacks.length);
    }

    // 3. Latest Resume Score
    const latestResume = await Resume.findOne({ user: userId }).sort('-createdAt');
    let resumeScore = 0;
    if (latestResume) {
      resumeScore = Math.min(100, 50 + (latestResume.skills?.length || 0) * 5);
    }

    // 4. Coding Score (Total solved challenges * 100 points)
    const acceptedCount = await Submission.countDocuments({ user: userId, status: 'accepted' });
    const codingScore = acceptedCount * 100;

    // 5. Monthly Progress Chart data (last 7 feedback reports)
    const monthlyProgress = feedbacks.slice(-7).map((f, idx) => ({
      name: `Test ${idx + 1}`,
      score: f.overallScore
    }));
    if (monthlyProgress.length === 0) {
      monthlyProgress.push(
        { name: 'Start', score: 0 },
        { name: 'Target', score: 80 }
      );
    }

    // 6. Upcoming Interviews
    const upcomingInterviews = await Interview.find({ user: userId, status: 'pending' })
      .sort('createdAt')
      .limit(5);

    // 7. Activity Timeline logs (dynamic lookup from submissions, resumes and mocks)
    const latestResumes = await Resume.find({ user: userId }).sort('-createdAt').limit(2);
    const latestSubmissions = await Submission.find({ user: userId }).sort('-createdAt').limit(2).populate('challenge', 'title');
    const latestInterviews = await Interview.find({ user: userId }).sort('-createdAt').limit(2);

    const activityList = [];
    latestResumes.forEach((r) => {
      activityList.push({
        type: 'resume',
        message: `Analyzed Resume: "${r.fileName}"`,
        date: r.createdAt
      });
    });
    latestSubmissions.forEach((s) => {
      activityList.push({
        type: 'coding',
        message: `Solved Challenge: "${s.challenge?.title || 'Algorithm'}"`,
        status: s.status,
        date: s.createdAt
      });
    });
    latestInterviews.forEach((i) => {
      activityList.push({
        type: 'interview',
        message: `Mock Session: "${i.title}"`,
        status: i.status,
        date: i.createdAt
      });
    });

    activityList.sort((a, b) => b.date - a.date);
    const activityTimeline = activityList.slice(0, 5);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalInterviews,
          avgScore,
          resumeScore,
          codingScore,
          weeklyProgress: [
            { day: 'Mon', solved: acceptedCount > 0 ? 1 : 0 },
            { day: 'Tue', solved: 0 },
            { day: 'Wed', solved: acceptedCount > 1 ? 1 : 0 },
            { day: 'Thu', solved: 0 },
            { day: 'Fri', solved: 0 },
            { day: 'Sat', solved: 0 },
            { day: 'Sun', solved: 0 }
          ],
          monthlyProgress,
          upcomingInterviews,
          activityTimeline
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
