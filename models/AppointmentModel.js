const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    doctorId: {
      type: String, // This will hold the value of doctorInfo._id
      required: [true, "doctorId is required"],
    },
    userInfo: {
      type: Object,
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;
