// require jwt, helper, User, List
var helper = require('../config/helpers.js');
var User = require('./userModel.js');
var url = require('url');

// export function
module.exports = {

  // TODO:
  // Coordinate with front end on what data
  // should be sent and received.

  // signin method
  signin: function(req, res) {
    // Provided by passwordless
    var email = req.user;

    // This find the user with the corresponding email
    User.findOne({ 'email': email }, function(err, user) {
      if (err) {
        console.log("mongo findOne signin err: ", err);
        helper.sendError(err, req, res);
      } else {
        if (!user) {
          helper.sendError("No user found", req, res);
        } else {
          res.json({
            userid: user['_id'],
            address: user['address'],
            name: user['name']['first'] + ' ' + user['name']['last']
          });
        }
      }
    });
  },

  // Signup method
  signup: function(req, res){
    var email = req.body.email;
    var newUserObj = req.body

    User.findOne({'email': email}, function(err, user){
      if (err) {
        console.log("mongo findOne signup err: ", err);
        helper.sendError(err, req, res);
      } else {
        if (user) {
          helper.sendError("Email already taken", req, res);
        } else {
          User.create(newUserObj, function(err, user){
            if (err) {
              console.log("mongo create user err: ", err);
              helper.sendError(err, req, res);
            } else {          
              res.json({
                user: user
              });
            }
          });
        }
      }
    });
  }
  // ,

  // findByID: function(req, res){
  //   var userID = '';
  //   var email = req.body.email;
  //   var newUserObj = req.body

  //   User.findOne({'_id': ObjectID(userID)}, function(err, user){
  //     if (err) { // notifies if error is thrown
  //       console.log("mongo findOne signup err: ", err);
  //       helper.sendError(err, req, res);
  //     } else {
  //       if (user) { // notifies if email is already taken

  //         res.json({
  //           username: user['username'],
  //           name: user['name']['first'] + ' ' + user['name']['last']
  //         });
  //       }
  //     }
  //   });
  // }

};