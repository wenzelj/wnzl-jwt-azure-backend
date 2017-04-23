var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');
    azureTableHelper = require('./n-azureTableHelper');

var app = module.exports = express.Router();
var tablename = "users";
// XXX: This should be a database of users :).
var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

// {
// 	"tableName": "users",
//     "partitionKey": "username",
//     "rowKey": "name",
//     "data":{
//     		"password": "password"
//     		}
//   }
app.post('/users', function(request, response) {
  if (!request.body.partitionKey || !request.body.rowKey || !request.body.data.password) {
    return request.status(400).send("You must send the username and the password");
  }
//   var request = {"query":{"tableName": req.body.tableName, "partitionKey": req.body.partitionKey}}
//   var result = azureTableHelper.get(request, res);


//   if (_.find(users, {username: req.body.username})) {
//    return res.status(400).send("A user with that username already exists");
//   }

//   var profile = _.pick(req.body, 'username', 'password', 'extra');
//   profile.id = _.max(users, 'id').id + 1;

//   users.push(profile);

    var res = {}

    res.status = function(st){
        function send(data){
            if(data.code == "EntityAlreadyExists"){
                 return response.status(400).send("A user with that username already exists");
            }
            else{
                var profile = _.pick(req.body, 'partitionKey', 'password', 'extra');
                response.status(201).send({id_token: createToken(profile)})
            }
            }

        return {
            send:send
        }
    }
    
  azureTableHelper.post(request, res);

});

app.post('/sessions/create', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  var user = _.find(users, {username: req.body.username});
  if (!user) {
    return res.status(401).send("The username or password don't match");
  }

  if (!user.password === req.body.password) {
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({
    id_token: createToken(user)
  });
});
