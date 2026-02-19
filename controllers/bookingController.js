const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

const createBooking = async (req, res) => {
  try {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { vehicleId, startDate, endDate } = req.body;

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
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
        .json({ message: "Vehicle is already booked for the selected dates" });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    const totalPrice = days * vehicle.rentPerDay;

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
    });

    vehicle.popularity += 1;
    await vehicle.save();

    req.io.emit("bookingCreated", { vehicleId });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    req.io.emit("bookingCancelled", { vehicleId: booking.vehicle });

    res.json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createBooking, cancelBooking, getMyBookings };
