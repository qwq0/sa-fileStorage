// src/routes/Login/index.ts
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path, { resolve } from 'path';
import { Md5things } from '../../crypto/Md5things.js';
import { Insert } from '../../database/Insert.js';
import { Select } from '../../database/Select.js';
import { FileThings } from '../../File/FileThings.js';

const router = express.Router();
const md5things = new Md5things();
let uploadError = null;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb)
//   {
//     const hash = md5things.calculateMd5(file.originalname);
//     const child = hash.substring(0, 2);
//     const uploadPath = `data/storage/image/${child}/`;
//     // 检查目标目录是否存在，如果不存在则创建
//     fs.mkdir(uploadPath, { recursive: true }, (err) =>
//     {
//       if (err)
//       {
//         console.error('无法创建目标目录:', err);
//         return cb(err, null);
//       }
//       cb(null, uploadPath);
//     });
//   },
//   filename: function (req, file, cb){
//     cb(null, file.filename);
//   }
// });

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  dest: 'uploads/',
  fileFilter: async function (req, file, cb)
  {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/'))
    {
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

    const file = req.file;
    file.filename = md5things.calculateMd5(file.buffer);
    const originalExt = path.extname(req.file.originalname);
    const downloadUrl = `/file/${req.file.filename}${originalExt}`;
    
    const filethings = new FileThings();

    const select = new Select();

    const resource = await select.selectResource(file.filename);

    if(resource){
      res.json({ code: -105, message: '文件已存在', downloadUrl: downloadUrl});
      return;
    }

    const saveResult = await filethings.trySaveFile(file);
    if(saveResult.status){
      const insert = new Insert();
      await insert.insertResource(file.filename, req.ip, file.size, new Date(Date.now() + 24 * 60 * 60 * 1000));
      res.json({ code: 0, message: 'Success', downloadUrl: downloadUrl });
    } else {
      res.json({ code: -104, message: saveResult.message });
    }
    
  } catch (error)
  {
    console.error(error);
    res.json({ code: -104, message: 'Error' });
    return;
  }
});

export {router as upload};
