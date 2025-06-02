const express = require('express');
const router = express.Router();
const { Question } = require('../models');

router.get('/:id', async (req, res) => {
  const question = await Question.findByPk(req.params.id);
  res.json(question);
});

module.exports = router;
