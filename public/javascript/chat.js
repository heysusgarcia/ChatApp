(function(root) {
  var C = root.C = (root.C || {});

  var Chat = C.Chat = function(socket, room) {
    this.socket = socket;
    this.room = room;

    this.socket.on("nicknameChangeResult", function (results) {
      var $result = $("<div class='changed'>").text(results.message);
      $(".messages").prepend($result);
      $('textarea').val('');
    });

    this.socket.on("message", function (message) {
      console.log("message?", message)
      var $message = $("<div class='bg-info'>").text(message.text);
      var timeStamp = $("<i class='timestamp pull-right'>").text(' ' + moment().format('LT'));
      $message.append(timeStamp);
      $(".messages").prepend($message);
      $('textarea').val('');
    });

    this.socket.on("roomChangeResult", function (result) {
      var $message = $("<div class='changed'>").text(result.message);
      $(".messages").prepend($message);
      $('textarea').val('');
      this.room = result.roomname;
    });
    this.socket.on("roomList", function (list) {
      var $list = $("<ul>");
      for (var i=0; i < list.length; i++) {
        var $li = $("<li>");
        $li.text(list[i]);
        $list.prepend($li);
      }
      $(".room-list").html($list);
      $(".room-list").prepend("<h1 style='margin-top: 0px'>Current Users</h1>")
    });
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
