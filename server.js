var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var router = require("./router.js");
var chatServer = require("./lib/chat_server.js");
var cors = require('cors');

var port = process.env.PORT || 8080;
var server = http.createServer(function (request, response) {
  router(request, response);

  // chatServer(http);
}).listen(port);

chatServer(server);

var app = express();
app.use(cors());

module.exports = chatServer
