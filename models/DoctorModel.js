const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    specialization: {
      type: String,
    },
    Contact: {
      type: String,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    image: {
      type: String,
    },
    Experience: {
      type: String,
      required: [true, "experience is required"],
    },
    timings: {
      type: Object,
      required: [true, "time is required"],
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
