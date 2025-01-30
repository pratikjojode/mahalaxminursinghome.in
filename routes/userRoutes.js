const express = require("express");
const {
  loginController,
  registerController,
  authController,
  getAllNotifications,
  getAllDoctorsUsers,
  bookAppointmentContrl,
  bookingAvailibity,
  getUserAppointmentsOnId,
  getUserAppointments,
  getProfileForUser,
  forgotPassword,
  deleteAppoinmentsControllerId,
  deleteAppointmentControllerId,
} = require("../controllers/userController");
const authMiddlware = require("../middlewares/authMiddlware");

// router function object
const router = express.Router();

// routes
// login||POST
router.post("/login", loginController);

// regsiter/POST
router.post("/register", registerController);

// get user route
router.post("/getUserData", authMiddlware, authController);

router.post("/get-all-notification", getAllNotifications);

router.get("/getAllDoctorsUsers", getAllDoctorsUsers);

router.post("/book-appointment", bookAppointmentContrl);

router.post("/booking-avaibility", bookingAvailibity);

router.get("/userBooking", authMiddlware, getUserAppointments);
router.post("/forgot-password", forgotPassword);
router.post("/userProfile", getProfileForUser);

router.delete("/deleteAppointments/:id", deleteAppointmentControllerId);
module.exports = router;
