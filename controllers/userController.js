// login controller
const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/DoctorModel");
const appointmentModel = require("../models/AppointmentModel");
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wromng during Login",
      error,
    });
  }
};

// register controller
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already exists",
      });
    }
    // hashed password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    // new user
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({
      message: "User Registered succefully",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong during registration",
      error,
    });
  }
};

// get user dtata
const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "User found succesfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wromng during geting the user data",
      success: false,
      error,
    });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.seenNotification.push(...user.notification);
    user.notification = [];

    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Notifications updated",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting the notifications",
    });
  }
};

const getAllDoctorsUsers = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully for the users",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors for the users",
      error,
    });
  }
};

const bookAppointmentContrl = async (req, res) => {
  try {
    const { userId, userInfo, doctorInfo, date, time } = req.body;

    if (!doctorInfo || !doctorInfo._id) {
      return res.status(400).send({
        success: false,
        message: "Doctor information is missing or invalid",
      });
    }

    // Parse the date and time together, using local time format
    const dateTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");

    // Convert the parsed local time to ISO format
    const dateTimeISO = dateTime.toISOString();

    // If dateTimeISO is invalid, handle the error
    if (!dateTime.isValid()) {
      return res.status(400).send({
        success: false,
        message: "Invalid date or time format",
      });
    }

    // Use doctorInfo._id as the doctorId
    const doctorId = doctorInfo._id; // This should now be valid

    req.body.status = "pending";

    const newAppointment = new appointmentModel({
      doctorId, // Use the _id from doctorInfo
      userId,
      userInfo,
      doctorInfo,
      date: dateTimeISO, // Store the combined ISO datetime
      time, // Optionally keep time separately if needed
      status: req.body.status,
    });

    await newAppointment.save();

    // Send the response with the userId
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
      userId, // Return the userId to the user
    });
  } catch (error) {
    console.log("Error in booking appointment:", error);
    res.status(500).send({
      success: false,
      message: "Error in booking appointment",
      error,
    });
  }
};

const deleteuserCtrl = async (req, res) => {
  try {
    const userId = req.body._id;
    const user = await userModel.findOneAndDelete({ userId });
    if (user) {
      res.status(200).send({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong during deleting the user",
      error,
    });
  }
};

const bookingAvailibity = async (req, res) => {
  try {
    const { date, time, doctorId } = req.body;

    // Convert the date and time to the correct format using `moment`
    const dateISO = moment(date, "DD-MM-YYYY").toISOString(); // Date in ISO format

    // Calculate the time range using `moment`
    const fromTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm")
      .add(1, "hours")
      .toISOString();

    // Log the calculated time range for debugging
    console.log("Checking availability from:", fromTime);
    console.log("Checking availability to:", toTime);

    // Query the database for existing appointments within the time range for the doctor
    const existingAppointments = await appointmentModel.find({
      doctorId: doctorId,
      date: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    // If appointments exist in the time range, the doctor is not available
    if (existingAppointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Doctor is not available at the selected time",
      });
    }

    // If no appointments are found, the doctor is available
    return res.status(200).send({
      success: true,
      message: "Doctor is available at the selected time",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in checking the available doctor",
      error,
    });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.body.userId;

    const userAppointments = await appointmentModel.find({ userId });

    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User appointments retrieved successfully.",
      data: userAppointments,
    });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving user appointments.",
    });
  }
};

const getProfileForUser = async (req, res) => {};

const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token (example only, replace with a secure token logic)
    const resetToken = Math.random().toString(36).substr(2);

    // Save the token to the user's record or database
    user.resetToken = resetToken;
    user.tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send the reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailText = `You requested a password reset. Please use the following link: ${resetUrl}`;

    await sendEmail(email, "Password Reset Request", emailText);

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error handling forgot password" });
  }
};

const deleteAppointmentControllerId = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    // Perform the deletion
    const result = await appointmentModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  loginController,
  registerController,
  authController,
  getAllNotifications,
  getAllDoctorsUsers,
  bookAppointmentContrl,
  deleteuserCtrl,
  bookingAvailibity,
  getUserAppointments,
  getProfileForUser,
  forgotPassword,
  deleteAppointmentControllerId,
};
