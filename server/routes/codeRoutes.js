const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Question } = require('../models');

router.post('/run', async (req, res) => {
const { source_code, language_id, stdin, questionId } = req.body;
console.log('Received body:', req.body);

try {
const question = await Question.findByPk(questionId);
if (!question) return res.status(404).json({ error: 'Question not found' });

const response = await axios.post(
'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
{ source_code, language_id, stdin },
{
headers: {
'Content-Type': 'application/json',
'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
'X-RapidAPI-Key': 'your_api_key_here'
}
}
);

const { stdout, stderr, compile_output } = response.data;

if (stderr) return res.json({ result: 'Failed', reason: `Runtime Error:\n${stderr}` });
if (compile_output) return res.json({ result: 'Failed', reason: `Compile Error:\n${compile_output}` });

const trimmedExpected = question.expected_output.trim();
const trimmedOutput = stdout.trim();

const passed = trimmedExpected === trimmedOutput;

res.json({
result: passed ? 'Passed' : 'Failed',
actual_output: trimmedOutput,
expected_output: trimmedExpected
});

} catch (err) {
console.error(err);
res.status(500).send({ message: err.message });
}
});

module.exports = router;
