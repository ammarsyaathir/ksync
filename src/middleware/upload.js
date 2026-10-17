// src/middleware/upload.js - File Upload Handler using Multer
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = new Set(['.jpeg', '.jpg', '.png', '.webp', '.gif', '.pdf']);
  const allowedMimes = new Set([
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]);
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.has(ext) && allowedMimes.has((file.mimetype || '').toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file upload. Only verified images (JPEG, PNG, WebP, GIF) and PDF files are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: fileFilter
});

export default upload;
