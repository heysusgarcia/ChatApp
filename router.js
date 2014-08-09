var fs = require("fs");
var http = require("http");
var cache = {};

var loadIndex = function (req, res) {
  fs.readFile("./public/index.html", { encoding: "utf8" }, function (err, data) {
    if (err) throw err;
    res.write(data);
    cache[req.url] = data;
    res.end();
  });
};

var publicRoute = function (req, res) {
  if (cache[req.url]) {
    res.write(cache[req.url]);
    res.end();
  } else {
    fs.readFile("./public" + req.url, { encoding: "utf8" }, function (err, data ) {
      if (err) {
        res.statusCode = 404;
        res.end();
      } else {
        res.write(data);
        cache[req.url] = data;
        res.end();
      }
    })
  }
};

var router = function (req, res) {
  console.log(req.url);
  if (req.url === "/") {
    loadIndex(req, res);
  } else {
    publicRoute(req, res);
  }
};

module.exports = router;