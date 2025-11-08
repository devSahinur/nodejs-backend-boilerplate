

const socketIO = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-room", (data, callback) => {
      if (data?.roomId) {
        socket.join(`room${  data.roomId}`);
        callback("Join room successful");
      } else {
        callback("Must provide a valid user id");
      }
    });

    socket.on("leave-room", (data) => {
      if (data?.roomId) {
        socket.leave(`room${  data.roomId}`);
      }
    });

    socket.on("disconnect", () => {
    });
  });
};

export default socketIO;
