import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported') as unknown as null, false);
      return;
    }
    cb(null, true);
  },
});