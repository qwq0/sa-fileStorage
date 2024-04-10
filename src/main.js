// app.js
import express from 'express';
import upload from './Routes/Upload/index.js';
const app = express();
const port = 3000;

const routes = [
    upload
]

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
