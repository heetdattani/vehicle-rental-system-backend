const express = require("express");
const router = express.Router();
const {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
} = require("../controllers/vehicleController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

//Public route to get all vehicles
router.get("/vehicles", getAllVehicles);

router.post("/vehicles", protect, adminOnly, createVehicle);
router.put("/vehicles/:id", protect, adminOnly, updateVehicle);
router.delete("/vehicles/:id", protect, adminOnly, deleteVehicle);
router.get("/vehicles/:id", protect, getVehicleById);

module.exports = router;
