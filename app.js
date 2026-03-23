const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Socket.IO
const { Server } = require("socket.io");
const io = new Server(server);

let usernames = [];

// Only start server if NOT in test
if (require.main === module) {
  server.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
  });
}

// Routes
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Socket logic
io.on('connection', function(socket){

  socket.on('new user', function(data, callback){
    if (usernames.includes(data)) {
      if (typeof callback === 'function') callback(false);
    } else {
      if (typeof callback === 'function') callback(true);

      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  function updateUsernames(){
    io.emit('usernames', usernames);
  }

  socket.on('send message', function(data){
    io.emit('new message', {
      msg: data,
      user: socket.username
    });
  });

  socket.on('disconnect', function(){
    if(!socket.username) return;

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});

// Export for testing
module.exports = { server };