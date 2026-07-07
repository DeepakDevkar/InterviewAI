import { Interview } from '../models/Interview.js';
import { Question } from '../models/Question.js';
import { Resume } from '../models/Resume.js';
import { Feedback } from '../models/Feedback.js';
import { AppError } from '../utils/appError.js';
import { validateFields } from '../utils/validation.js';
import { generateInterviewQuestions, evaluateInterviewAnswers } from '../utils/gemini.js';
import { logger } from '../utils/logger.js';
import { sendNotification } from '../utils/notification.js';
import { sendInterviewStatusUpdate } from '../config/socket.js';

export const createInterview = async (req, res, next) => {
  try {
    validateFields(req.body, ['title', 'roleType']);
    const { title, roleType, difficulty, company, technology, resumeId, questionsCount } = req.body;

    // 1. If resumeId is provided, fetch CV text to pass as candidate context
    let experienceContext = '';
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (resume) {
        experienceContext = resume.rawText || '';
      }
    }

    // 2. Call Gemini API generator
    const generationResult = await generateInterviewQuestions({
      role: roleType,
      difficulty: difficulty || 'medium',
      company: company || 'a general tech firm',
      technology: technology || '',
      experience: experienceContext,
      questionsCount: parseInt(questionsCount || '5', 10)
    });

    // 3. Create parent Interview placeholder
    const newInterview = await Interview.create({
      user: req.user._id,
      title,
      roleType,
      difficulty: difficulty || 'medium',
      status: 'pending',
      questions: []
    });

    // 4. Save generated questions referencing the parent interview
    const questionDocs = [];
    for (const q of generationResult.questions) {
      const createdQuestion = await Question.create({
        interview: newInterview._id,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty || difficulty || 'medium',
        options: q.options || [],
        correctOptionIndex: q.correctOptionIndex,
        skeletonCode: q.skeletonCode,
        testCases: q.testCases || []
      });
      questionDocs.push(createdQuestion._id);
    }

    // 5. Update interview with question IDs
    newInterview.questions = questionDocs;
    await newInterview.save();

    // Populate questions to return complete details
    const populatedInterview = await Interview.findById(newInterview._id).populate('questions');

    // Trigger in-app, socket and email notification alerts
    await sendNotification({
      userId: req.user._id,
      title: 'Interview Scheduled Successfully',
      message: `Your mock interview session "${title}" for target role "${roleType}" is ready. Start practicing!`,
      type: 'info'
    });

    res.status(201).json({
      status: 'success',
      data: { interview: populatedInterview }
    });
  } catch (error) {
    logger.error('Failed to create interview:', error);
    next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .populate('questions')
      .sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: interviews.length,
      data: { interviews }
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id }).populate('questions');
    if (!interview) {
      return next(new AppError('Interview session not found', 404));
    }

    const feedback = await Feedback.findOne({ interview: interview._id });

    res.status(200).json({
      status: 'success',
      data: { 
        interview,
        feedback
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterviewAnswers = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return next(new AppError('Interview session not found', 404));
    }

    // 1. Update individual questions answers in DB
    if (req.body.questions && Array.isArray(req.body.questions)) {
      for (const q of req.body.questions) {
        await Question.findOneAndUpdate(
          { _id: q._id, interview: interview._id },
          { 
            userAnswer: q.userAnswer || '', 
            durationSeconds: q.durationSeconds || 0 
          }
        );
      }
    }

    // Update status to completed
    interview.status = 'completed';
    await interview.save();

    // Trigger real-time status update push to socket client
    sendInterviewStatusUpdate(req.user._id, interview._id, 'completed');

    // 2. Fetch all fully updated questions for this interview
    const dbQuestions = await Question.find({ interview: interview._id });

    // 3. Map for Gemini Evaluation API call
    const evaluationPayload = dbQuestions.map((q) => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      options: q.options || [],
      correctOptionIndex: q.correctOptionIndex,
      userAnswer: q.userAnswer || ''
    }));

    // 4. Trigger Gemini evaluation utility
    const evaluationResult = await evaluateInterviewAnswers({
      role: interview.roleType,
      difficulty: interview.difficulty,
      questionsAndAnswers: evaluationPayload
    });

    // 5. Save or update evaluation results in Feedback model
    const feedbackDoc = await Feedback.findOneAndUpdate(
      { interview: interview._id },
      {
        overallScore: evaluationResult.overallScore,
        technicalScore: evaluationResult.technicalScore,
        communicationScore: evaluationResult.communicationScore,
        confidenceScore: evaluationResult.confidenceScore,
        grammarScore: evaluationResult.grammarScore,
        strengths: evaluationResult.strengths || [],
        weaknesses: evaluationResult.weaknesses || [],
        generalSuggestions: evaluationResult.generalSuggestions || '',
        improvedAnswers: evaluationResult.improvedAnswers || [],
        status: 'published',
        aiModelUsed: 'gemini-1.5-flash'
      },
      { upsert: true, new: true }
    );

    const populatedInterview = await Interview.findById(interview._id).populate('questions');

    res.status(200).json({
      status: 'success',
      message: 'Interview responses submitted and evaluated successfully.',
      data: { 
        interview: populatedInterview,
        feedback: feedbackDoc
      }
    });
  } catch (error) {
    logger.error('Failed to evaluate mock responses:', error);
    next(error);
  }
};
