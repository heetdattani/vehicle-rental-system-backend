const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
    description: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
