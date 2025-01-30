const express = require("express");
const {
  uploadDoctorImage,
  createDoctor,
  getDoctorInfo,
  updateDoctorProfile,
  getSingleDoctorByid,
  getAppointmentForDoctor,
} = require("../controllers/doctorController");
const upload = require("../middlewares/fileUpload");

const router = express.Router();
const authMiddlware = require("../middlewares/authMiddlware");
// Route to create a doctor with image upload
router.post("/createDoctor", upload.single("image"), createDoctor);

// Separate route to upload/update doctor image
router.post("/uploadImage/:id", upload.single("image"), uploadDoctorImage);

// get songle dcoto info
router.post("/getDoctorInfo", authMiddlware, getDoctorInfo);

// updare profile
router.post("/updateDocProfile", authMiddlware, updateDoctorProfile);

router.get("/singleDocInfoById/:doctorId", getSingleDoctorByid);

// Route for fetching doctor appointments
router.get(
  "/getappointmentForDoctor/:doctorId",
  authMiddlware,
  getAppointmentForDoctor
);
module.exports = router;
