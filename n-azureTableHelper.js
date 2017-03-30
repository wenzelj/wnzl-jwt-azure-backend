var azureTable = require('azure-table-node');
var config = require('./n-config');

azureTable.setDefaultClient(config.azureConfig);
var client = azureTable.getDefaultClient();
//var tableSvc = azureTable.createTableService();

function Entity(partitionKey, rowKey, value1, etag) {
    this.PartitionKey = partitionKey;
    this.RowKey = rowKey;
    this.value1 = value1;
    this.__etag = etag
}

function handleError(error, response) {
    if (error != null && error != undefined) {
        console.log(error);
        response.status(200).send(error)
    }
}

function handleSuccess(data, response) {
    if (data != null && data != undefined) {
        console.log(data);
        response.status(200).send(data);
    }
}

// function createTableIfNotExists(tableName, response) {
//     tableSvc.createTableIfNotExists(tableName, function (error, result, response) {
//          handleError(error, response);
//          handleSuccess(data, response);
//     });
// }

function getPromise (tableName, partitionKey, name) {
    var promise = new Promise(function (resolve, reject) {
        client.getEntity(tableName, partitionKey, name, [], function (error, data) {
            console.log(error);
            console.log(data);
            if (error != undefined) {
                reject(error);
            }

            if (data != undefined) {
                resolve(JSON.parse(data.value1));
            }
        });
    })
    return promise;
}

function get(tableName, partitionKey, request, response) {
    client.queryEntities(tableName, {
        query: azureTable.Query.create('PartitionKey', '==', partitionKey)
    },
        function (error, data, continuation) {
            handleError(error, response);
            handleSuccess(data, response);
        })
}

//Post example 
// {
// 	"tableName": "advertsTable",
//     "partitionKey": "geoadds",
//     "rowKey": "CKGConsulting2",
//     "data":{
//     		"value1": "test",
//     		"value2": "test"
//     		}
//   }

//post 
function post(request, response) {
    var data = JSON.stringify(request.body.data);
    
    var entity = new Entity(request.body.partitionKey, request.body.rowKey, data);
    client.insertEntity(tableName, entity, function (error, data) {
           handleError(error, response);
            handleSuccess(data, response);
    });
}

// {
// 	"tableName": "advertsTable",
//     "partitionKey": "geoadds",
//     "rowKey": "CKGConsulting2",
//     "data":{
//     		"value1": "test",
//     		"value2": "update"
//     		}
//   }

//put 
function put(request, response) {
    var data = JSON.stringify(request.body.data);

    var entity = new Entity(request.body.partitionKey, request.body.rowKey, data);
    client.updateEntity(request.body.tableName, entity, { force: true }, function (error, data) {
        handleError(error, response);
        handleSuccess(data, response);
    });
}

// {
// 	"tableName": "advertsTable",
//     "partitionKey": "geoadds",
//     "rowKey": "CKGConsulting2",
//     "data":{
//     		"value1": "test",
//     		"value2": "update"
//     		}
//   }

//delete
function deleteEntity(request, response) {
    var data = JSON.stringify(request.body.data);
    var etag = request.body.__etag

    var entity = new Entity(request.query.partitionKey, request.query.rowKey, '', etag);
    client.deleteEntity(request.query.tableName, entity, {force: true}, function (error, data) {
        handleError(error, response);
        handleSuccess(data, response);
    });
}

module.exports = {
    getPromise : getPromise,
    get : get,
    post : post,
    put : put,
    delete : deleteEntity
}