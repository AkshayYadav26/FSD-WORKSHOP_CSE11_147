const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = 5000;

// ---------- Middleware ----------
// cors() allows the React frontend (running on a different port) to call this API
app.use(cors());
// express.json() lets us read JSON data sent in request bodies (req.body)
app.use(express.json());

// ---------- Routes ----------
app.use('/api/students', studentRoutes);

// Simple health-check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Student Management System API is running' });
});

// ---------- Start the server ----------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
