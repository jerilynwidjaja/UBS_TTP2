const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Question } = require('../models');

router.post('/run', async (req, res) => {
  const { source_code, language_id, stdin } = req.body;
  console.log('Received body:', req.body);
  console.log(Question);

  try {
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      { source_code, language_id, stdin },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': '31cd9c8d8bmsh944c840a9e4d4c8p18c539jsn7ae96231294a'
        }
      }
    );

    const { stdout, stderr, compile_output } = response.data;

    if (stderr) return res.json({ output: `Runtime Error:\n${stderr}` });
    if (compile_output) return res.json({ output: `Compile Error:\n${compile_output}` });

    res.json({ output: stdout });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
