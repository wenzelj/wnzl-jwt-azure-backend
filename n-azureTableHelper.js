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

//post 
function post(tableName, partitionKey, request, response) {
    var data = JSON.stringify(request.body.data);
    
    var entity = new Entity(request.body.partitionKey, request.body.rowKey, data);
    client.insertEntity(tableName, entity, function (error, data) {
           handleError(error, response);
            handleSuccess(data, response);
    });
}

//put 
function put(tableName, partitionKey, request, response) {
    var body = JSON.stringify(request.body);
    var name = body.name;
    var partitionKey = partitionKey;
    var entity = new Entity(partitionKey, name, body);
    client.updateEntity(tableName, entity, { force: true }, function (error, data) {
        handleError(error, response);
        handleSuccess(data, response);
    });
}

//delete
function deleteEntity(tableName, partitionKey, request, response) {
    var body = JSON.stringify(request.body);
    var name = body.name;
    var etag = body.__etag

    var entity = new Entity(partitionKey, name, '', etag);
    client.deleteEntity(tableName, entity, function (error, data) {
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