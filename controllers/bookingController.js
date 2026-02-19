const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const { bookingValidation } = require("../validations/bookingValidation");

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: "error" });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found", status: "error" });
    }

    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: "booked",
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({
          message: "Vehicle is already booked for the selected dates",
          status: "error",
        });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    const totalPrice = days * vehicle.rentPerDay;

    if (days <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid booking dates", status: "error" });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
    });

    vehicle.popularity += 1;
    await vehicle.save();

    await Vehicle.updateOne(
      { _id: vehicleId },
      { $set: { isAvailable: false } },
    );

    req.io.emit("bookingCreated", { vehicleId });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      status: "success",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found", status: "error" });
    }

    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to cancel this booking",
        status: "error",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    req.io.emit("bookingCancelled", { vehicleId: booking.vehicle });

    res.json({ message: "Booking canceled successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("vehicle")
      .sort({ createdAt: -1 });
    res.json({ bookings, status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

module.exports = { createBooking, cancelBooking, getMyBookings };
