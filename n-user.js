var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');
    azureTableHelper = require('./n-azureTableHelper');
    cryptoAes = require("crypto-js/aes");
var app = module.exports = express.Router();
var tablename = "users";
// XXX: This should be a database of users :).
var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];

function encryptPassword(password){
  var encrypted = cryptoAes.encrypt(password, config.secret); 
   return encrypted.ciphertext;
}

function decryptPassword(password){
   return cryptoAes.decrypt(password, config.secret);
}

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
app.post('/register', function(request, response) {
  if (!request.body.partitionKey || !request.body.rowKey || !request.body.data.password) {
    return request.status(400).send("You must send the username and the password");
  }


    var res = {}
    res.status = function(st){
        function send(data){
            if(data.code == "EntityAlreadyExists"){
                 return response.status(400).send("A user with that username already exists");
            }
            else{
                var profile = _.pick(request.body, 'partitionKey', 'password', 'extra');
                response.status(201).send({id_token: createToken(profile)})
            }
            }
        return {
            send:send
        }
    }
    
    request.body.data.password = encryptPassword(request.body.data.password);
  azureTableHelper.post(request, res);

});

// {
// 	"tableName": "users",
//     "partitionKey": "username",
//     "rowKey": "name",
//     "data":{
//     		"password": "password"
//     		}
//   }
app.post('/sessions/create', function(req, res) {
  if (!req.body.partitionKey || !req.body.data.password) {
    return res.status(400).send("You must send the username and the password");
  }

  var user = azureTableHelper.get(req, res);
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
