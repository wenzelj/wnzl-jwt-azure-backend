var express = require('express');
var app = module.exports = express.Router();

var azureTable = require('azure-table-node');
azureTable.setDefaultClient({
    accountUrl: 'https://ckgconsulting.table.core.windows.net/',
    accountName: 'ckgconsulting',
    accountKey: 'Sx+XIP3oD8OAaIdHgmP008tro+5HWboQLrLva6AXGreBY6+pFcEcew2qOBYfEWQGhlU4bGsyafetcC1H+u7Z8A=='
});
var client = azureTable.getDefaultClient();
var tableName = 'analyticstable';
var partitionKey = 'analytics';

function Entity(partitionKey, rowKey, value1) {
    this.PartitionKey = partitionKey;
    this.RowKey = rowKey;
    this.value1 = value1;
}

function azureTableCallBack(error, data) {
    console.log(error);
    console.log(data);
}

app.get('/api/analytics/getAll', function (req, res) {
    client.queryEntities(tableName, {
        query: azureTable.Query.create('PartitionKey', '==', partitionKey)
    },
        function (error, data, continuation) {
            if (error != null && error != undefined) {
                console.log(error);
                res.status(200).send(error)
            }

            if (data != null && data != undefined) {
                console.log(data);
                var result = [];

                data.forEach(function (item) {
                    var jsonValue = JSON.parse(item.value1);
                    jsonValue.__etag = item.__etag
                    result.push(jsonValue);
                })
                res.status(200).send(result);
            }
        })
})
        






