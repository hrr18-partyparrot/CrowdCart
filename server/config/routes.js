// require userHandler, listHandler
var userHandler = require('../users/userHandler.js');
var listHandler = require('../lists/listHandler.js');
// var stripeHandler = require('../stripe/stripeHandler.js');
var passwordless = require('passwordless');

// export function
module.exports = function(app, express){

  // Passwordless Get user by Email
  app.get('/api/signin', userHandler.signin);

  // POST - signup
  app.post('/api/signup', userHandler.signup);
  // POST - JobStatus to buyer
  app.post('/api/addJobStatus', listHandler.addJobStatus);

  // POST - Sends a Cancel status to the buyer
  app.post('/api/addCancelStatus', listHandler.addCancelStatus);
  // POST - Sends a Complete status to the buyer
  app.post('/api/addCompleteStatus', listHandler.addCompleteStatus);
  // POST - addList
  app.post('/api/lists', listHandler.addList);

  // GET - getList (single list)
  app.get('/api/list/:id', listHandler.getOneList);

  // GET - getLists (users lists)
  app.get('/api/lists/:id', listHandler.getLists);

  // PUT - for updating list
  app.put('/api/lists', listHandler.updateList);

  // DELETE - deletes a single list
  app.delete('/api/lists/:id', listHandler.deleteList);

  // GET - getAllLists
  app.get('/api/crowd', listHandler.getAllLists);

  // GET - getJobs (users accepted jobs)
  app.get('/api/jobs/:id', listHandler.getJobs);

  // POST - getJobs (user updates job when completed)
  app.post('/api/jobs', listHandler.updateJobStatus);

  // POST - updateStatus (reflects when jobs/lists are assigned)
  app.post('/api/status', listHandler.updateStatus);

  // PUT - modify the list being edited
  app.put('/api/modify', listHandler.modifyList);

  // Passwordless Logout
  app.get('/api/logout', passwordless.logout(), function(req, res) { res.redirect('/') })

  //app.get('/api/checkout', stripeHandler.???);
  //app.post('/api/checkout', stripeHandler.payNow);

  // Passwordless Send Email
  app.post('/sendtoken', passwordless.requestToken(function(user, delivery, callback) {
    callback(null, user);
  }), function(req, res) {
    res.send('Email sent');
  });
};