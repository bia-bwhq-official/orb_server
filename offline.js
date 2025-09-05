var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
const fs = require("fs");


app.use(express.static("offline"));


http.listen(3000, function(){
  var port = http.address().port;
  console.log('Fuckworld is execution offline pages to location router on the port %s' + '!', port);
});