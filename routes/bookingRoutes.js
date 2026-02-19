const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.delete("/:id/cancel", protect, cancelBooking);
router.get("/my-bookings", protect, getMyBookings);

module.exports = router;
