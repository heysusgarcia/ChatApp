var socket = io.connect();

var Chat = new C.Chat(socket, "lobbyTemp");

var getMessage = function() {
  var $form = $('form');
  var formData = $form.serializeJSON();
  return formData.message;
};

var sendMessage = function(message) {
  Chat.sendMessage(message);
};

var processCommand = function (message) {
  if (message.indexOf("nick") === 1) {
    var nickname = message.split(" ")[1];

    Chat.changeNickname(nickname);
  } else if (message.indexOf("join") === 1) {
    var room = message.split(" ")[1];
    Chat.changeRoom(room);
  } else {
    $(".messages").prepend("<div class='row message-row'><div class='col-xs-12 warning'>command not recognized</div></div>");
  }
}

$(document).ready(function () {
  $('form').on("submit", function(event) {
    event.preventDefault();

    var message = getMessage();
    if (message.charAt(0) === "/") {
      processCommand(message);
    } else {
      sendMessage(message);
    }
  });
});
