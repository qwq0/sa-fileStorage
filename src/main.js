import express from 'express';
import { Upload } from './routes/upload/Upload.js';
import { IncreaseQuote } from './routes/increaseQuote/IncreaseQuote.js';
import bodyParser from 'body-parser';
import path from 'path';
import { Database } from './database/index.js';
import { Task } from './task/Task.js';
import { FileThings } from './File/FileThings.js';
const app = express();

const ft = new FileThings();

const config = await ft.getConfig();

const db = new Database(config.database.dialect, config.database.storage, config.database.logging);

console.log(config);

const databaseObject = {
  connect: db.connectDatabase(),
  resourceTable: await db.resourceTable(),
  quoteTable: await db.quoteTable()
};

const upload = new Upload();
const increaseQuote = new IncreaseQuote();

const routes = [
  upload.createRouter(databaseObject),
  increaseQuote.createRouter(databaseObject, config.server.token)
];

const task = new Task();
task.init(databaseObject);

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

app.listen(config.server.port, () =>
{
  console.log(`Example app listening at http://${config.server.host}:${config.server.port}`);
});

