const doctorModel = require("../models/DoctorModel");
const Doctor = require("../models/DoctorModel");
const userModel = require("../models/userModels");
const AppointModel = require("../models/AppointmentModel");
// Controller to create a new doctor
const createDoctor = async (req, res) => {
  try {
    // Extract data from request body
    const {
      userId,
      firstName,
      lastName,
      Contact,
      email,
      address,
      Experience,
      timings,
      status,
      specialization,
    } = req.body;

    // Check if an image was uploaded and get its path
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Create a new doctor instance
    const newDoctor = new Doctor({
      userId,
      firstName,
      lastName,
      Contact,
      email,
      address,
      image,
      Experience,
      timings,
      status,
      specialization,
    });

    // Save the doctor to the database
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor account`,
      doctorId: newDoctor._id,
      name: (newDoctor.firstName = " " + lastName),
      onClickPath: "/admin/doctors",
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res
      .status(201)
      .json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating doctor", error: error.message });
  }
};

// Controller to update/upload doctor image
const uploadDoctorImage = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if an image was uploaded and update its path in the doctor record
    if (req.file) {
      doctor.image = `/uploads/${req.file.filename}`;
      await doctor.save();
    }

    res.status(200).json({ message: "Image uploaded successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

// get doctro info
const getDoctorInfo = async (req, res) => {
  try {
    console.log("Request userId:", req.body._id); // Log userId received in request
    const doctor = await doctorModel.findOne({ userId: req.body._id });
    console.log("Doctor data:", doctor); // Log the fetched doctor data
    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log("Error fetching doctor details:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor's details",
      error,
    });
  }
};

// update the doctor
const updateDoctorProfile = async (req, res) => {
  try {
    // Destructure the updated data from the request body
    const {
      _id,
      firstName,
      lastName,
      email,
      contact,
      address,
      Experience,
      timings,
      specialization,
    } = req.body;

    // Find the doctor by userId and update the fields
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: _id }, // Ensure you're using the correct identifier
      {
        firstName,
        lastName,
        email,
        contact,
        address,
        Experience,
        timings,
        specialization,
      }, // Updated data
      { new: true } // This option ensures that the updated doctor is returned
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error,
    });
  }
};

const getSingleDoctorByid = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.params.doctorId }); // Use req.params to get doctorId
    res.status(200).send({
      success: true,
      message: "Single doctor fetched by their id",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor not fetched by their id",
      error,
    });
  }
};

const deleteDoctorCtrl = async (req, res) => {
  try {
    const doctorId = req.body.id;
    const doctor = await doctorModel.findOneAndDelete(doctorId);
    res.status(200).send({
      success: true,
      message: "doctor deletd succfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor deleted succefully",
      error,
    });
  }
};

// Modify the route to include doctorId as a parameter
const getAppointmentForDoctor = async (req, res) => {};

module.exports = {
  createDoctor,
  uploadDoctorImage,
  getDoctorInfo,
  updateDoctorProfile,
  getSingleDoctorByid,
  deleteDoctorCtrl,
  getAppointmentForDoctor,
};
