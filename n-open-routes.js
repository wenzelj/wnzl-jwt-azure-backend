var express = require('express'),
    azureTableHelper = require('./n-azureTableHelper');

var app = module.exports = express.Router();

// This is where all calls not needing auth goes

// app.get('/api/open',function(request, response){
//     azureTableHelper.get(request, response);
// })

// app.post('/api/open',function(request, response){
//     azureTableHelper.post(request, response);
// })

// app.put('/api/open',function(request, response){
//     azureTableHelper.put(request, response);
// })

// app.delete('/api/open',function(request, response){
//      azureTableHelper.delete(request, response);
// })

// {
// 	"tableName": "errorLogs",
//     "partitionKey": "Date",
//     "rowKey": "Time",
//     "data":{
//     		"error": "errors message"
//     		}
//   }
//log errors 
app.post('/api/log',function(request, response){
    azureTableHelper.post(request, response);
})




