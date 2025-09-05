var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const password = "bigblackoilyballs"

app.use(express.static('public'));
app.use('/src', express.static(__dirname + '/public/src'));


http.listen(process.env.PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});


var users = 0;
io.on('connection', function(socket) {
  users++;
  console.log('Client connected to the WebSocket [users: ' + users + ']');
  io.emit('updateUsers', users);
  io.emit('newConnection','bigblackoilyballs');
  let msg = "";
  let user = "";

  socket.on('updateUsers', usercount => {
    io.emit('updateUsers', users);
  })

  socket.on('newConnection', pass => {
    if(pass !== password){
      return;
    }
    if(pass == password){
      io.emit('newConnection');
    }
  })
  
  socket.on('disconnect', () => {
    users--;
    console.log('Client disconnected [users: ' + users + ']');
    io.emit('updateUsers', users);
  });

  socket.on('message', message => {
    if(message.includes('<')){
      return;
    } else {
      socket.broadcast.emit('message', message)
      console.log(user + ': ' + message)
    }
  })

  socket.on('name', name => {
    socket.broadcast.emit('name', name);
    user = name;
  })

  socket.on('avatarSet', avatarURL => {
    socket.broadcast.emit('avatarSet', avatarURL)
  })
})