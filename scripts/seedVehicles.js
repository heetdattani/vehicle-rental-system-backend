require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const connectDB = require("../config/db");

const vehicles = [
  {
    name: "Toyota Fortuner",
    type: "SUV",
    rentPerDay: 120,
    description: "A comfortable and spacious SUV, perfect for family trips.",
    image: "https://example.com/images/fortuner.jpg",
    popularity: 0,
  },
  {
    name: "Honda Civic",
    type: "Sedan",
    rentPerDay: 80,
    description: "A compact sedan with great fuel efficiency.",
    image: "https://example.com/images/civic.jpg",
    popularity: 0,
  },
  {
    name: "Royal Enfield Classic 350",
    type: "Bike",
    rentPerDay: 40,
    description: "A classic motorcycle with a vintage design.",
    image: "https://example.com/images/classic350.jpg",
    popularity: 0,
  },
];

const seedVehicles = async () => {
  try {
    await connectDB();
    await Vehicle.deleteMany({});
    await Vehicle.insertMany(vehicles);
    console.log("Vehicles seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding vehicles:", error);
    process.exit(1);
  }
};

seedVehicles();
