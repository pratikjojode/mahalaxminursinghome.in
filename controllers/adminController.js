const userModel = require("../models/userModels");

const doctorModel = require("../models/DoctorModel");
const appointmentModel = require("../models/AppointmentModel");
const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "User list fetched succesfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User not fetched",
      error,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors fetched succefully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doctors fetching",
      error,
    });
  }
};

const changeAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    // Find and update the doctor's status
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if doctor has a userId
    if (!doctor.userId) {
      return res.status(404).send({
        success: false,
        message: "Associated user not found for this doctor",
      });
    }

    // Find the associated user
    const user = await userModel.findById(doctor.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Associated user not found",
      });
    }

    // Ensure notifications array exists
    user.notification = user.notification || [];
    user.notification.push({
      type: "doctor-account-request-updated",
      message: `Your doctor account request has been ${status}`,
      onClickPath: "/notification",
    });

    // Update the isDoctor status based on account approval
    user.isDoctor = status === "approved";
    await user.save();

    res.status(201).send({
      success: true,
      message: "Account status updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating account status",
      error,
    });
  }
};

const getAllAppointmentsForAdmin = async (req, res) => {
  try {
    // Fetch all appointments from the database
    const appointments = await appointmentModel.find({});

    // Check if no appointments were found
    if (appointments.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No appointments found.",
      });
    }

    // Return appointments if successful
    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully for the admin.",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching appointments for the admin.",
    });
  }
};

const deleteAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Get the ID from URL params

    // Check if the appointment ID is provided
    if (!appointmentId) {
      return res.status(400).send({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // Find the appointment by ID and delete it
    const appointment = await appointmentModel.findByIdAndDelete(appointmentId);

    // If appointment not found, return a 404 response
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found with the provided ID",
      });
    }

    // If appointment is found and deleted, return success
    res.status(200).send({
      success: true,
      message: "Appointment deleted successfully",
      data: appointment,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while deleting the appointment",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Get the appointment ID from the URL params
    const updatedStatus = "approved"; // The new status to set for the appointment

    // Find the appointment by its ID and update the status if it's 'pending'
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found with the provided ID",
      });
    }

    // If the current status is 'pending', update it to 'approved'
    if (appointment.status === "pending") {
      appointment.status = updatedStatus;
      await appointment.save(); // Save the updated appointment
      return res.status(200).send({
        success: true,
        message: "Appointment status updated to approved successfully",
        data: appointment,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Appointment status is not 'pending', cannot be updated",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while updating the appointment status",
      error: error.message,
    });
  }
};

const viewAppointmentForAdmin = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Get the appointment ID from the route params
    const appointment = await appointmentModel.findById(appointmentId); // Fetch the appointment by ID

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found for the given ID.",
      });
    }

    // Successfully fetched the appointment
    res.status(200).send({
      success: true,
      message: "Appointment fetched successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching appointment. Please try again later.",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params; // User ID from URL parameter
  const { name, email, isAdmin, isDoctor } = req.body; // Updated user data from the request body

  try {
    // Find the user by ID and update the data
    const user = await userModel.findByIdAndUpdate(
      id,
      { name, email, isAdmin, isDoctor }, // Update these fields
      { new: true } // Return the updated user object
    );

    // If the user does not exist, return an error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If successful, return the updated user data
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user, // Return the updated user data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  getAllUsers,
  getAllDoctors,
  changeAccountStatus,
  getAllAppointmentsForAdmin,
  deleteAppointmentById,
  updateAppointmentStatus,
  viewAppointmentForAdmin,
  updateUser,
};
