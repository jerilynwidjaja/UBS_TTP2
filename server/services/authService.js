const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

require('dotenv').config();

async function signup(email, password) {
  const hash = await bcrypt.hash(password, 10);
  await db.User.create({ email, password: hash });
}

async function login(email, password) {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
}

async function updateCareerDetails(userId, details) {
  const user = await db.User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const { careerStage, skills, goals, timeAvailability, level } = details;

  await user.update({
    careerStage,
    skills: skills.join(','),
    learningGoals: goals.join(','),
    timeAvailability,
    level,
  });
}

async function getCareerDetails(userId) {
  const user = await db.User.findByPk(userId, {
    attributes: [
      'email',
      'careerStage',
      'skills',
      'learningGoals',
      'timeAvailability',
      'level',
    ],
  });

  if (!user) throw new Error('User not found');
  return user;
}

module.exports = {
  signup,
  login,
  updateCareerDetails,
  getCareerDetails,
};
