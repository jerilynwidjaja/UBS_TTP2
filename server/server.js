import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import questionRoutes from './routes/questions.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
res.json({
status: 'OK',
timestamp: new Date().toISOString(),
environment: process.env.NODE_ENV || 'development'
});
});

const startServer = async () => {
try {
await sequelize.sync({ force: false });
console.log('Database synced successfully');

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log(`Health check: http://localhost:${PORT}/api/health`);
});
} catch (error) {
console.error('Unable to start server:', error);
}
};

startServer();