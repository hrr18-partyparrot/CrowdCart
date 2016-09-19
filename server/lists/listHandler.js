// require helper, User, List
var helper = require('../config/helpers.js');
var User = require('../users/userModel.js');
var List = require('./listModel.js');

// required for emailjs to work
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

// export function
module.exports = {

  // TODO:
  // Coordinate with front end on what data
  // should be sent and received.

  // used to edit list
  modifyList: function(req, res) {
    var listId = req.body._id;
    console.log('record if when editing list: ', listId);
    List.findById(listId, function(err, list) {
      if (err) {
        console.log('modifyList Error in listHandler.js');
        console.error(err);
      }
      list.items = req.body.items;
      list.save();
      res.json('list has been modified');
    });
  },

  // addList method
  addList: function(req, res){
    var newListObj = req.body;

    List.create(newListObj, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo create list err: ", err);
        helper.sendError(err, req, res);
      } else { // list created, sends 201 status
        //res.status(201);
        res.json(list);
      }
    });
  },

   // updateList method
  updateList: function(req, res){
    var id = req.body.creator_id;
    var due_at = req.body.due_at;
    var name = req.body.name;

    // var conditions = {'creator_id': id, 'due_at': due_at, 'name': name, 'deliverer_id': ''};
    // var update = {'deliverer_id': req.body.deliverer_id};

    // List.update(conditions, update)

    List.findOne({'creator_id': id, 'due_at': due_at, 'name': name}, function(err, list){
          if (err) {
            console.log('List Findone ERROR ****** ');
            console.error(err);
          }
          list.deliverer_id = req.body.deliverer_id;
          list.save();
          res.json(list);
        }
    );

  },

  // deleteList method
  deleteList: function(req, res){
    var listid = req.params.id;

    List.remove({'_id': listid}, function(err, result){
      if (err) { // notifies if error is thrown
        console.log("mongo deleteOne list err: ", err);
        helper.sendError(err, req, res);
      } else { // delete successful, sends result of operation
        res.json(result);
      }
    });
  },

  // getOneList method
  getOneList: function(req, res){
    var listid = req.params.id;

    List.findOne({'_id': listid}, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo findOne list err: ", err);
        helper.sendError(err, req, res);
      } else {
        if (!list) { // notifies if list is not found
          helper.sendError("List not found", req, res);
        } else { // list found, returns list
          res.json(list);
        }
      }
    });
  },

  // getLists method
  getLists: function(req, res){
    // var userid = req.body.userid;

    // temporarily passing through url
    var userid = req.params.id

    List.find({'creator_id': userid})
      .then(function(lists){
        res.json(lists);
      });
  },

  // getAllLists method
  getAllLists: function(req, res){
    List.find({})
      .then(function(lists) { // returns array of lists
        res.json(lists);
      });
  },

  // getJobs method
  getJobs: function(req, res){
    var userid = req.params.id;
    console.log('$$$$$$$$$$$')
    List.find({'deliverer_id': userid})
      .then(function(lists){
        res.json(lists);
      });
  },

  //to send job status to buyer via email
  addJobStatus: function(req, res) {
    var list = req.body;
    var creator_id = req.body.creator_id;
    var deliverer_id = req.body.deliverer_id;
    var creatorEmail, delivererName;
    var listName = req.body.name;
    console.log(list);
    User.findOne({'_id': creator_id}, function(err, creator) {
      if (err) { // notifies if error is thrown
        console.log("mongo findOne list err: ", err);
      } else {
        creatorEmail = creator.email;
        creatorName = creator.name.first
        User.findOne({'_id': deliverer_id}, function(err, deliverer) {
          if (err) {
            console.log("Error finding deliverer in addJobStatus");
          } else {
            delivererName = deliverer.name.first + " " + deliverer.name.last;
            smtpServer.send({
              from:    "Crowd Cart Operations <contact.crowdcart@gmail.com>",
              to:      "<" + creatorEmail + ">",
              subject: "Job Status",
              text:    "Hi " + creatorName + ",\nThis is to status message to inform you that your list \"" + listName + "\" has been picked up by " + delivererName + "."
            }, function(err, message) { console.log(err || message); });
          }
        })
      }
    })
  },

  // updateJobStatus method (corrected version)
  updateJobStatus: function(req, res){
    // TODO: Fill Out
  },

  // updateStatus method
  updateStatus: function(req, res){
    var listid = req.body.listid;
    var userid = req.body.userid;

    List.findOne({'_id': listid}, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo findOne list err: ", err);
      } else {
        if (!list) { // notifies if list is not found
          helper.sendError("List not found", req, res);
        } else {
          List.update({'_id': listid}, {'deliverer_id': userid}, function(err, result){
            if (err) { // notifies if error is thrown
              console.log("mongo update err: ", err);
            } else { // update successful, returns result
              res.json(result);
            }
          });
        }
      }
    });
  }

};