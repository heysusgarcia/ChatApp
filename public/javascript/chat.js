(function(root) {
  var C = root.C = (root.C || {});
  
  var Chat = C.Chat = function(socket, room) {
    this.socket = socket;
    this.room = room;
    
    this.socket.on("nicknameChangeResult", function (results) {
      var $result = $("<div>").text(results.message);
      $(".messages").append($result);
    });
    
    this.socket.on("message", function (message) {
      console.log("message?", message)
      var $message = $("<div class='bg-info'>").text(message.text);
      $(".messages").append($message);
    });
    
    this.socket.on("roomChangeResult", function (result) {
      var $message = $("<div>").text(result.text);
      $(".messages").append($message);
      this.room = result.roomname;
    });
    this.socket.on("roomList", function (list) {
      var $list = $("<ul>");
      for (var i=0; i < list.length; i++) {
        var $li = $("<li>");
        $li.text(list[i]);
        $list.append($li);
      }
      $(".room-list").html($list);
      $(".room-list").prepend("<h1>Current Users</h1>")
    })
  };
  
  Chat.prototype.sendMessage = function(message) {
    this.socket.emit("message", { text: message });
  };
  
  Chat.prototype.changeNickname = function (nickname) {
    this.socket.emit("nicknameChangeRequest", nickname);
  };
  
  Chat.prototype.changeRoom = function(room) {
    this.socket.emit("handleRoomChangeRequests", room);
  };
  
})(this);