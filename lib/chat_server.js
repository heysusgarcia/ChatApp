var socketIO = require("socket.io");

var NicknameManger = require("./nickname.js");

var currentRooms = {};
var tempLobby = "lobbyTemp";
var nicknames = new NicknameManger();

var roomList = function(room, io) {
  var list = [];

  for (key in currentRooms) {
    if (currentRooms[key] === room) {
      list.push(key);
    }
  }

  list = list.map(function (socketid) {
    return nicknames.nicknames[socketid];
  });

  io.sockets.emit("roomList", list);
}

var joinRoom = function(socket, room, io) {
  currentRooms[socket.id] = room;

  socket.join(room, function () { console.log(arguments) });

  roomList(room, io);
};

var handleRoomChangeRequests = function(socket, room, io) {

  socket.leave(currentRooms[socket.id]);
  joinRoom(socket, room, io);

  socket.emit("roomChangeResult", {
    success: true,
    message: "room changed to " + room, roomname: room
  })
};

var createChat = function (server) {

  var io = socketIO(server);

  io.on("connection", function (socket) {
    nicknames.generateName(socket);

    joinRoom(socket, tempLobby, io);

    socket.on("handleRoomChangeRequests", function(room) {
      handleRoomChangeRequests(socket, room, io);
    })

    socket.on('nicknameChangeRequest', function (nickname) {
      nicknames.updateNickname(socket, nickname);
      roomList(currentRooms[socket.id], io);
    });

    socket.on("message", function (data) {
      var room = currentRooms[socket.id];
      // console.log("posting " + data.text + " to " + room);
      console.log("sending message", socket.rooms)
      io.to(room).emit("message", {
        text: (nicknames.getNickname(socket) + ": " + data.text)})
    });

    socket.on("disconnect", function () {
      nicknames.removeNickname(socket);
      delete currentRooms[socket.id];
    });
  });
};

module.exports = createChat;
