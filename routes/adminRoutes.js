const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlware");
const {
  getAllUsers,
  getAllDoctors,
  changeAccountStatus,
  getAllAppointmentsForAdmin,
  deleteAppointment,
  deleteAppointmentById,
  updateAppointmentStatus,
  viewAppointmentForAdmin,
  updateUser,
} = require("../controllers/adminController");
const { deleteuserCtrl } = require("../controllers/userController");
const { deleteDoctorCtrl } = require("../controllers/doctorController");
// routes for admin

// get user
router.get("/getAllUsers", getAllUsers);

router.get("/getAllDoctors", getAllDoctors);

// POST method acclunt status
router.post("/changeAccountStatus", changeAccountStatus);

router.delete("/delete-user", deleteuserCtrl);

router.delete("/delete-doctor", deleteDoctorCtrl);

router.get("/getAlltheAppoinmentsAdmin", getAllAppointmentsForAdmin);

router.delete("/deleteAppointment/:id", deleteAppointmentById);

router.put("/updateAppointmentStatus/:id", updateAppointmentStatus);

// Define the route
router.get("/appointmentViewAdmin/:id", viewAppointmentForAdmin);

router.put("/update-user/:id", updateUser);

module.exports = router;
