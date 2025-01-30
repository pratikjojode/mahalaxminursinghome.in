const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedBackModel");

// POST: Submit feedback
router.post("/userfeedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      data: feedback,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all feedback (optional, for admin use)
router.get("/getfeedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a specific feedback by ID
router.delete("/deletefeedback/:id", async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update a specific feedback by ID
router.put("/updatefeedback/:id", async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully.",
      data: updatedFeedback,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
