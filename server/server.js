// require express, mongoose, middleware, routes
var express = require('express');
var middleware = require('./config/middleware.js');
var routes = require('./config/routes.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// set mongoURI
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/crowdcart';

// connect db
mongoose.connect(mongoURI);

// set port
var port = process.env.PORT || 1337;


app.get('/livechat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});


//set middleware
middleware(app, express);

// set routes
routes(app, express);

// export app
module.exports.app = app;

module.exports.io = io;




