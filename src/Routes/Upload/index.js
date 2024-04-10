// src/routes/Login/index.ts
import express from 'express';


const router = express.Router();

router.post('/upload', async (req, res) =>
{
  try
  {
    const request = req.body;
    console.log(request);
  } catch (error)
  {
    console.error(error);
    res.json({ code: -101, message: 'Error' });
    return;
  }

});
export default router;
