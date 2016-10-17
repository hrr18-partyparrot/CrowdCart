// require express, mongoose, middleware, routes
var express = require('express');
var middleware = require('./config/middleware.js');
var routes = require('./config/routes.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
// maps socket.id to user's nickname
var usernames = {};
// list of socket ids
var clients = [];
var namesUsed = [];
// set mongoURI
var mongoURI = 'mongodb://localhost/crowdcart';

// connect db
mongoose.connect(mongoURI);

// set port
var port = 80;


app.get('/livechat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  handleChoosingUsername(socket);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

function handleChoosingUsername(socket){
  socket.on('choose username', function(nick, cb) {
    if (namesUsed.indexOf(nick) !== -1) {
      cb('That name is already taken!  Please choose another one.');
      return;
    }
    var ind = namesUsed.push(nick) - 1;
    clients[ind] = socket;
    usernames[socket.id] = nick;
    cb(null);
    io.emit('new user', {id: ind, nick: nick});
  });
}

http.listen(port, function(){
  console.log('listening on port 1337');
});


// set middleware
middleware(app, express);

// set routes
routes(app, express);

// export app
module.exports.app = app;

module.exports.io = io;




