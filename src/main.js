import express from 'express';
import upload from './routes/upload/index.js';
import bodyParser from 'body-parser';
import path from 'path';
import { Database } from './database/index.js';
const app = express();
const port = 3000;

const routes = [
  upload
];
const currentWorkingDir = process.cwd();

app.get('/file/:filename.:ext', (req, res) =>
{
  const { filename, ext } = req.params;

  const folder = filename.substring(0, 2);

  const filePath = path.join(currentWorkingDir, 'data/storage/image', folder, `${filename}`);
  // 检查文件是否存在
  res.sendFile(filePath, (err) =>
  {
    if (err)
    {
      console.error('发送文件时出错:', err); // 添加错误日志
      res.status(404).send('文件未找到');
    }
  });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>
{
  res.send('Hello');
});

app.use('/', routes);

app.listen(port, () =>
{
  console.log(`Example app listening at http://localhost:${port}`);
});

