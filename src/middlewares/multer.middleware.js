// utils/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ham log yahan diskStorage ko prefer karte hain in place of the normal storage taaki woh zyada data store kar sake 
// cb -> callback
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('public', 'temp');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({ storage });
