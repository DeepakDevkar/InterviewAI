import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import cloudinary from '../config/cloudinary.js';
import { Resume } from '../models/Resume.js';
import { AppError } from '../utils/appError.js';
import { parseResumeText } from '../utils/resumeParser.js';
import { logger } from '../utils/logger.js';
import { sendNotification } from '../utils/notification.js';

const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary keys are configured, fallback if not
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      logger.warn('Cloudinary not configured. Mocking upload url.');
      return resolve({ secure_url: `https://res.cloudinary.com/mock/raw/upload/resumes/${Date.now()}-${originalname}` });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        resource_type: 'raw',
        public_id: `${Date.now()}-${originalname.replace(/\.[^/.]+$/, '')}`
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload stream failed:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a resume file', 400));
    }

    const { buffer, originalname, mimetype } = req.file;

    // 1. Extract text from document buffer
    let text = '';
    try {
      if (mimetype === 'application/pdf') {
        const data = await pdfParse(buffer);
        text = data.text;
      } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        originalname.endsWith('.docx')
      ) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else {
        return next(new AppError('Unsupported file type. Please upload a PDF or DOCX file.', 400));
      }
    } catch (err) {
      logger.error('Text extraction failed:', err);
      return next(new AppError('Failed to parse text from the uploaded document', 500));
    }

    if (!text || text.trim() === '') {
      return next(new AppError('No text could be extracted from this document. Ensure it is not empty or scanned.', 400));
    }

    // 2. Upload file to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(buffer, originalname);
    } catch (err) {
      // Fallback fallback URL in case upload fails even with keys configured (e.g. offline)
      logger.warn('Cloudinary upload failed, using fallback mock URL.');
      uploadResult = { secure_url: `https://res.cloudinary.com/mock/raw/upload/resumes/${Date.now()}-${originalname}` };
    }

    // 3. Process text through parsing and ATS scoring engine
    const analysis = parseResumeText(text);

    // 4. Save metadata in DB
    const newResume = await Resume.create({
      user: req.user._id,
      fileName: originalname,
      fileUrl: uploadResult.secure_url,
      skills: analysis.skills,
      rawText: text,
      status: 'completed'
    });

    // Trigger in-app, socket and email notifications
    await sendNotification({
      userId: req.user._id,
      title: 'Resume Analyzed Successfully',
      message: `Your resume "${originalname}" has been parsed and evaluated. ATS score: ${analysis.score}/100.`,
      type: 'success'
    });

    res.status(200).json({
      status: 'success',
      data: {
        resumeId: newResume._id,
        fileName: newResume.fileName,
        fileUrl: newResume.fileUrl,
        analysis
      }
    });
  } catch (error) {
    next(error);
  }
};
