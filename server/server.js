require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Feedback = require('./models/Feedback');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://manthan-2025-xi.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// API Route
app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(allFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));