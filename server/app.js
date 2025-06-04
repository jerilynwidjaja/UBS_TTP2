require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const seedRoutes = require('./routes/seedRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/code', codeRoutes);
app.use('/courses', coursesRoutes);
app.use('/questions', questionsRoutes);
app.use('/seed', seedRoutes);

// Start server only after syncing DB
(async () => {
  try {
    console.log('Syncing database...');
    await db.sequelize.sync();
    console.log('Database synced successfully.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Optional: handle unhandled promise rejections & uncaught exceptions globally
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });

  } catch (err) {
    console.error('Unable to connect to the DB:', err);
    process.exit(1); // Exit the process if DB connection fails
  }
})();
