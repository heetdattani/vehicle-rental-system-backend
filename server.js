const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const socketIO = require("./socket/socket");
const vehicleRoutes = require("./routes/vehicleRoutes");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", vehicleRoutes);
app.use("/api/bookings", require("./routes/bookingRoutes"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
