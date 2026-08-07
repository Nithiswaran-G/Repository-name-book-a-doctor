import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { connectMongo } from './config/dbMongo.js';
import { seedMongoDatabase } from './database/seedMongo.js';
import { exportDatabase } from './controllers/adminController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors({ origin: '*' }));
app.use(express.json());

// Auto-connect MongoDB and Seed MERN Database
connectMongo().then(() => {
  seedMongoDatabase();
}).catch(console.error);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MediNova - Book A Doctor MERN API Server',
    database: 'MongoDB Atlas Cloud (book-a-doc)',
    endpoints: {
      health: '/api/health',
      doctors: '/api/doctors',
      specializations: '/api/doctors/specializations',
      auth_login: '/api/auth/login'
    }
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Direct MongoDB Export Route
app.get('/api/export-database', exportDatabase);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Book A Doctor MERN MongoDB API Server is running smoothly!' });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  🚀 Book A Doctor MERN API Server running on port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
