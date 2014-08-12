(function(root) {
  var C = root.C = (root.C || {});

  var Chat = C.Chat = function(socket, room) {
    this.socket = socket;
    this.room = room;

    this.socket.on("nicknameChangeResult", function (results) {
      var $result = $("<div class='col-xs-9 changed'>").text(results.message);
      var $div = $("<div class='row message-row'>");
      $reuslt = $div.append($result);
      $(".messages").prepend($result);
    });

    this.socket.on("message", function (message) {
      var $message = $("<div class='col-xs-9 bg-info' style='height: auto'>").text(message.text);
      var timeStamp = $("<i class='col-xs-3 timestamp pull-right'>").text(' ' + moment().format('LT'));
      var $div = $("<div class='row message-row'>");
      $message = $div.append($message);
      $message.append(timeStamp);
      $(".messages").prepend($message);
    });

    this.socket.on("roomChangeResult", function (result) {
      var $message = $("<div class='col-xs-9 changed'>").text(result.message);
      var $div = $("<div class='row'>");
      $message = $div.append($message);
      $(".messages").prepend($message);
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
    $('textarea').val('');
  };

  Chat.prototype.changeNickname = function (nickname) {
    this.socket.emit("nicknameChangeRequest", nickname);
    $('textarea').val('');
  };

  Chat.prototype.changeRoom = function(room) {
    this.socket.emit("handleRoomChangeRequests", room);
    $('textarea').val('');
  };

})(this);
