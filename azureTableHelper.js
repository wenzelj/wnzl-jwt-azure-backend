var express = require('express')
var app = express()
var azure = require('azure-storage');
 
// app.get('/notes', function(req, res) {
//   res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
// }),

// app.get('/adverts', function(req, res){
// 	 //res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
// res.json({adverts:[
// 				{src: "http://mysmarthome.cloudapp.net/images/CKGLogo.jpg", voucher: "http://mysmarthome.cloudapp.net/images/vouchers/voucher1.png" },
// 				{src: "http://mysmarthome.cloudapp.net/images/image1.jpg", voucher: "http://mysmarthome.cloudapp.net/images/vouchers/voucher2.png" },
// 				{src: "http://mysmarthome.cloudapp.net/images/image2.jpg", voucher: "http://mysmarthome.cloudapp.net/images/vouchers/voucher3.png" }
// 	]})
// })
 
// app.listen(8080)


exports.getRandomOne = function() {
  var totalAmount = quotes.length;
  var rand = Math.ceil(Math.random() * totalAmount);
  return quotes[rand];
}





// Adverts
var tableSvc = azure.createTableService();
tableSvc.createTableIfNotExists('adverts', function(error, result, response){
  if(!error){
    // Table exists or created
  }
});

// entity
var entGen = azure.TableUtilities.entityGenerator;

var task = function(partitionkey, rowkey, value) {
  PartitionKey: entGen.String(partitionkey),
  RowKey: entGen.String(rowkey),
  description: entGen.String(value),
  dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
};

// Add to table
function addToTable(tableName, task){
	tableSvc.insertEntity(tableName, task, function (error, result, response) {
	  if(!error){
	    return true;
	  }
	  return false;
	});
}
// Update
function replaceEntity(tableName, updatedTask){
	// Replace entity
	tableSvc.replaceEntity('mytable', updatedTask, function(error, result, response){
	  if(!error) {
	    return true;
	  }
	  return false;
	});	
}
//query
function query(tablename, partitionkey, rowkey){
	tableSvc.retrieveEntity(tableName, partitionkey, rowkey, function(error, result, response){
	  if(!error){
	    // result contains the entity
	    return true;
	  }
	  return false;
	});
}

// Delete
var deleteTask = function (partitionkey, rowkey) {
	PartitionKey: {'_': partitionkey},
	 RowKey: {'_': 'rowkey'}
}

function delete(tablename, deleteTask){
tableSvc.deleteEntity('mytable', task, function(error, response){
	  if(!error) {
	    // Entity deleted
	    return true;
	  }
	  return false;
	});
}



