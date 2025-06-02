const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
require('dotenv').config();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    await authService.signup(email, password);
    res.status(201).send({ message: 'User created' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.send({ token });
  } catch (err) {
    const status = err.message === 'User not found' ? 404 : 401;
    res.status(status).send({ message: err.message });
  }
});

router.post('/career-details', authMiddleware, async (req, res) => {
  try {
    await authService.updateCareerDetails(req.user.userId, req.body);
    res.json({ message: 'Career details updated successfully' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/career-details', authMiddleware, async (req, res) => {
  try {
    const user = await authService.getCareerDetails(req.user.userId);
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
