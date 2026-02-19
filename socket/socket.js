const socketIO = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);
  });
  return io;
};

module.exports = socketIO;
