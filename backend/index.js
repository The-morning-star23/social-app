// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// --- Initializations ---
dotenv.config();
const app = express();
// Render sets its own port, so we must use process.env.PORT
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// --- Basic Test Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- MongoDB Connection & Server Start ---
// This is the corrected logic:
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully.');
  
  // --- Start Server ---
  // We ONLY start listening *after* the database is connected.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  // If the database connection fails, log the error and don't start the server.
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit with a failure code
});