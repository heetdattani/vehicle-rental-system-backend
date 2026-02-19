const Vehicle = require("../models/Vehicle");
const { vehicleSchema } = require("../validations/vehicleValidation");

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (type) {
      query.type = type;
    }
    if (minPrice || maxPrice) {
      query.rentPerDay = {};
      if (minPrice) query.rentPerDay.$gte = Number(minPrice);
      if (maxPrice) query.rentPerDay.$lte = Number(maxPrice);
    }
    const vehicles = await Vehicle.find(query)
      .sort(sort ? { rentPerDay: sort === "asc" ? 1 : -1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Vehicle.countDocuments(query);
    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { error } = vehicleSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, status: "error" });
    }

    const { name, type, rentPerDay, description, image } = req.body;

    const vehicle = await Vehicle.create({
      name,
      type,
      rentPerDay,
      description,
      image,
    });

    res.status(201).json({
      vehicle,
      message: "Vehicle created successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { error } = vehicleSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, status: "error" });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found", status: "error" });
    }
    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json({
      vehicle,
      message: "Vehicle updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found", status: "error" });
    }
    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found", status: "error" });
    } else {
      res.json({
        vehicle,
        message: "Vehicle retrieved successfully",
        status: "success",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

module.exports = {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
};
