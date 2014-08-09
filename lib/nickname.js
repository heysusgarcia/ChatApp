function NicknameManger() {
  this.nicknames = {};
  this.guestnumber = 1;
}

NicknameManger.prototype.exists = function (nickname) {
  var nicknameAlreadyExists = false;
  for (var key in this.nicknames) {
    if (this.nicknames[key] === nickname) {
      nicknameAlreadyExists = true;
    }
  }
  
  return nicknameAlreadyExists
};

NicknameManger.prototype.updateNickname = function (socket, nickname) {
  if (this.exists(nickname)) {
    socket.emit("nicknameChangeResult", {
      success: false,
      message: "Nickname already exists"
    });
  } else if (nickname.indexOf("Guest") === 0) {
    socket.emit("nicknameChangeResult", {
      success: false,
      message: "Nickname can't begin with 'Guest'"
    });
  } else {
    socket.emit("nicknameChangeResult", {
      success: true,
      message: nickname + " set as nickname"
    });
    
    this.nicknames[socket.id] = nickname;
  }
}

NicknameManger.prototype.removeNickname = function (socket) {
  delete this.nicknames[socket.id];
}

NicknameManger.prototype.generateName = function(socket) {
  this.nicknames[socket.id] = "guest" + this.guestnumber;
  this.guestnumber++; 
}

NicknameManger.prototype.getNickname = function (socket) {
  return this.nicknames[socket.id];
}

module.exports = NicknameManger;