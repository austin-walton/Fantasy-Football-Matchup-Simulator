const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // This allows your frontend to talk to your backend
app.use(express.json()); // This lets your backend understand JSON data

// Test route - you probably already have this
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

