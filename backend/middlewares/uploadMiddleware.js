import multer from 'multer';
import { AppError } from '../utils/appError.js';

// Use memory storage for buffer upload to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow common file types (images, pdfs, audio)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'audio/mpeg',
    'audio/wav',
    'audio/webm'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Unsupported file format: ${file.mimetype}`, 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
