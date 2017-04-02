var express = require('express'),
    quoter = require('./quoter'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    azureTableHelper = require('./n-azureTableHelper');

var app = module.exports = express.Router();

// This is where all calls not needing auth goes
var apiPath = '/api/data';

var jwtCheck = jwt({
  secret: config.secret
});
app.use(apiPath, jwtCheck);

app.get('/api/random-quote', function (req, res) {
    res.status(200).send(quoter.getRandomOne());
});

app.get(apiPath ,function(request, response){
    azureTableHelper.get(request, response);
})

app.post(apiPath ,function(request, response){
    azureTableHelper.post(request, response);
})

app.put(apiPath ,function(request, response){
    azureTableHelper.put(request, response);
})

app.delete(apiPath ,function(request, response){
     azureTableHelper.delete(request, response);
})




