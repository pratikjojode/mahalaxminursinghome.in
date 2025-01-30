const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Optional if users don't want to provide it.
    trim: true,
  },
  email: {
    type: String,
    required: false,
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Validation for email
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  staffRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  cleanlinessRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  foodRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  suggestions: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
