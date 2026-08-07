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

// Root Welcome Visual Landing Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MediNova | Backend API Status</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #070A0F;
          color: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .container {
          background: #111827;
          border: 1px solid #1F2937;
          padding: 40px;
          border-radius: 24px;
          max-width: 550px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .badge {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 10px 0;
        }
        p {
          color: #9CA3AF;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn {
          background: #1F2937;
          color: #10B981;
          border: 1px solid #374151;
          padding: 12px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn:hover {
          background: #10B981;
          color: #070A0F;
        }
        .btn-primary {
          background: #10B981;
          color: #070A0F;
        }
        .btn-primary:hover {
          background: #34D399;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">● Live & Connected</span>
        <h1>🩺 MediNova API Server</h1>
        <p>Your MERN Stack Doctor Appointment Booking Backend is online and connected to <strong>MongoDB Atlas Cloud (book-a-doc)</strong>.</p>
        
        <div class="links">
          <a class="btn btn-primary" href="https://nithiswaran-g.github.io/Repository-name-book-a-doctor/" target="_blank">Open MediNova Frontend Website 🚀</a>
          <a class="btn" href="/api/health">Check API Health Status (/api/health)</a>
          <a class="btn" href="/api/doctors">Browse 89 Doctors API (/api/doctors)</a>
          <a class="btn" href="/api/doctors/specializations">Browse Specializations API (/api/doctors/specializations)</a>
        </div>
      </div>
    </body>
    </html>
  `);
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
