import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { extname } from 'path';

const allowedMimeTypes = ['image/webp', 'image/png', 'image/jpeg'];

export const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      const day = now.getDate().toString().padStart(2, '0');
      const uploadPath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        yearMonth,
        day,
      );

      // Ensure the directory exists
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error('Somente arquivos webp, png e jpg são permitidos!'),
        false,
      );
    }
    cb(null, true);
  },
};

export const upload = multer(multerConfig).single('dogImage');
