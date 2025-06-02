const express = require('express');
const router = express.Router();
const { Course, Question } = require('../models');

router.get('/', async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
});

router.get('/:id/questions', async (req, res) => {
  const questions = await Question.findAll({ where: { courseId: req.params.id } });
  res.json(questions);
});

module.exports = router;
