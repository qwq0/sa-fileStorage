// src/routes/Login/index.ts
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {Md5things} from '../../crypto/md5things.js';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const md5things = new Md5things();
    const hash = md5things.calculateMd5(file.originalname);
    const child = hash.substring(0, 2);
    const uploadPath = `Image/${child}/`;
    // 检查目标目录是否存在，如果不存在则创建
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('无法创建目标目录:', err);
        return cb(err, null);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const md5things = new Md5things();
    const hash = md5things.calculateMd5(file.originalname);
    const filename = hash;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: function (req, file, cb)
  {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/'))
    {
      cb(null, true);
    } else
    {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.post('/upload', upload.single('image'), async (req, res) =>
{
  try
  {
    const request = req.body;
    console.log(request);
    res.json({ code: 0, message: 'Success' });
  } catch (error)
  {
    console.error(error);
    res.json({ code: -104, message: 'Error' });
    return;
  }
});
export default router;
