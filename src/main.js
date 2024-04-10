// app.js
import express from 'express';
import upload from './routes/upload/index.js';
import bodyParser from 'body-parser';
import path from 'path';
const app = express();
const port = 3000;

const routes = [
    upload
]
const currentWorkingDir = process.cwd();
app.use('/Image', express.static(path.join(currentWorkingDir, 'Image')));

app.get('/Image/:folder/:filename.:ext', (req, res) => {
  const { folder, filename, ext } = req.params;
  const filePath = path.join(currentWorkingDir, 'Image', folder, `${filename}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('发送文件时出错:', err); // 添加错误日志
      res.status(404).send('文件未找到');
    }
  });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
