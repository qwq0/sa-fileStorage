// src/routes/Login/index.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import { Md5things } from '../../crypto/Md5things.js';
import { Insert } from '../../database/Insert.js';
import { Select } from '../../database/Select.js';
import { FileThings } from '../../File/FileThings.js';
import { Model, Sequelize } from '@sequelize/core';
export class Upload
{

  /**
   * 
   * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject 
   * @returns 
   */
  uploadRouter(databaseObject)
  {
    const router = express.Router();
    const md5things = new Md5things();
    let uploadError = null;

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

    return router.post('/upload', upload.single('image'), async (req, res) =>
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

        const resource = await select.selectResource(file.filename,databaseObject.resourceTable);

        if (resource)
        {
          res.json({ code: -105, message: '文件已存在', downloadUrl: downloadUrl });
          return;
        }

        const saveResult = await filethings.trySaveFile(file);
        if (saveResult.status)
        {
          const insert = new Insert();
          await insert.insertResource(file.filename, req.ip, file.size, new Date(Date.now() + 10 * 60 * 1000), databaseObject);
          res.json({ code: 0, message: 'Success', downloadUrl: downloadUrl });
        } else
        {
          res.json({ code: -104, message: saveResult.message });
        }

      } catch (error)
      {
        console.error(error);
        res.json({ code: -104, message: 'Error' });
        return;
      }
    });
  }
}
