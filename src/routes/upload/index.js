// src/routes/Login/index.ts
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Md5things } from '../../crypto/md5things.js';
import { Insert } from '../../database/Insert.js';
import { Select } from '../../database/select.js';

const router = express.Router();
const md5things = new Md5things();
let uploadError = null;
const storage = multer.diskStorage({
  destination: function (req, file, cb)
  {
    const hash = md5things.calculateMd5(file.originalname);
    const child = hash.substring(0, 2);
    const uploadPath = `data/storage/image/${child}/`;
    // 检查目标目录是否存在，如果不存在则创建
    fs.mkdir(uploadPath, { recursive: true }, (err) =>
    {
      if (err)
      {
        console.error('无法创建目标目录:', err);
        return cb(err, null);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb){
    cb(null, file.filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: async function (req, file, cb)
  {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/'))
    {
      // 在这里生成文件名
      file.filename = md5things.calculateMd5(file.originalname);
      // 在这里检查文件是否已经存在
      const select = new Select();
      const resource = await select.selectResource(file.filename);
      if (resource)
      {
        uploadError = { code: -101, message: '文件已存在' };
        cb(null, false);
      }
      cb(null, true);
    } else
    {
      uploadError = { code: -104, message: '只允许上传图片文件' };
      cb(null, false);
    }
  }
});

router.post('/upload', upload.single('image'), async (req, res) =>
{
  try
  {
    if (uploadError)
    {
      // 如果有错误信息，返回错误
      res.status(400).json(uploadError);
      uploadError = null; // 清空错误信息
      return;
    }
    const originalExt = path.extname(req.file.originalname);
    const downloadUrl = `/file/${req.file.filename}${originalExt}`;
    const insert = new Insert();
    await insert.insertResource(req.file.filename, req.ip, new Date(Date.now() + 24 * 60 * 60 * 1000));
    res.json({ code: 0, message: 'Success', downloadUrl: downloadUrl });
  } catch (error)
  {
    console.error(error);
    res.json({ code: -104, message: 'Error' });
    return;
  }
});
export default router;
