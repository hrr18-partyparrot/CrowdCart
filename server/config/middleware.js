// require morgan, bodyParser
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

// TODO: email setup (has to be changed)
var yourEmail = 'contact.crowdcart@gmail.com';
var yourPwd = 'crowdcart123';
var yourSmtp = 'smtp.gmail.com';
var smtpServer  = email.server.connect({
   user:    yourEmail, 
   password: yourPwd, 
   host:    yourSmtp, 
   ssl:     true
});

// TODO: Path to be send via email
var host = 'http://localhost:1337';

// Setup of Passwordless
passwordless.init(new MongoStore('mongodb://localhost/crowdcart'));
passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
	// Send out token
  smtpServer.send({
    text:    'Hello!\nYou can now access your account here: ' 
      + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend), 
    from:    yourEmail, 
    to:      recipient,
    subject: 'Token for ' + host
  }, function(err, message) { 
  	if(err) {
    	console.log(err);
  	}
  	callback(err);
	});
});


// export function
module.exports = function(app, express) {

  // use morgan
  app.use(morgan('dev'));

  // use bodyParser
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

	// Passwordless middleware
	app.use(cookieParser());
	app.use(expressSession({secret: '42', saveUninitialized: false, resave: false}));
	app.use(passwordless.sessionSupport());
	app.use(passwordless.acceptToken({ successRedirect: '/#/signin' }))

  // use express.static to serve client folder
  app.use(express.static(__dirname + '/../../client'));
};


