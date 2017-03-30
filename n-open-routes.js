var express = require('express'),
    quoter = require('./quoter'),
    azureTableHelper = require('./n-azureTableHelper');

var app = module.exports = express.Router();

// This is where all calls not needing auth goes

app.get('/api/random-quote', function (req, res) {
    res.status(200).send(quoter.getRandomOne());
});

app.get('/api/open',function(request, response){
    azureTableHelper.get('advertstable', 'geoadds', request, response);
})

app.post('/api/open',function(request, response){
    azureTableHelper.post(request, response);
})

app.put('/api/open',function(request, response){
    azureTableHelper.put(request, response);
})

app.delete('/api/open',function(request, response){
     azureTableHelper.delete(request, response);
})




