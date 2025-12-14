const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  food: { type: Number, required: true, min: 1, max: 5 },
  stay: { type: Number, required: true, min: 1, max: 5 },
  conference: { type: Number, required: true, min: 1, max: 5 },
  campus: { type: Number, required: true, min: 1, max: 5 },
  activities: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, maxlength: 1000 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DelegateFeedback', FeedbackSchema);