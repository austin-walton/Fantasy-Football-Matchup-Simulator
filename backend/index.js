const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/players');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow frontend to connect
const corsOptions = {
  origin: [
    'http://localhost:3000',  // React default port
    'http://localhost:5173',  // Vite default port
    'http://localhost:4173',  // Vite preview port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions)); // This allows your frontend to talk to your backend
app.use(express.json()); // This lets your backend understand JSON data

// Routes
app.use('/api/players', playerRoutes);

// Test route - you probably already have this
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fantasy Football Matchup Simulator Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      players: '/api/players/:year',
      playerStats: '/api/players/:year/stats/:playerName',
      search: '/api/players/:year/search?q=:searchTerm'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Player API available at http://localhost:${PORT}/api/players`);
  console.log('CORS enabled for frontend development servers');
});

