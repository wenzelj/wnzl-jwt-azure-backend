var express = require('express'),
    quoter = require('./quoter');
    advertHelper = require('./advertHelper');

var app = module.exports = express.Router();

var azureTable = require('azure-table-node');
azureTable.setDefaultClient({
    accountUrl: 'https://ckgconsulting.table.core.windows.net/',
    accountName: 'ckgconsulting',
    accountKey: 'Sx+XIP3oD8OAaIdHgmP008tro+5HWboQLrLva6AXGreBY6+pFcEcew2qOBYfEWQGhlU4bGsyafetcC1H+u7Z8A=='
});
var client = azureTable.getDefaultClient();
var tableName = 'advertstable';
var partitionKey = 'geoadds';
var tableAnalytics = 'analyticstable';
var partitionKeyAnalytics = 'analytics'; 

function Entity(partitionKey, rowKey, value1) {
    this.PartitionKey = partitionKey;
    this.RowKey = rowKey;
    this.value1 = value1;
}

function azureTableCallBack(error, data) {
    console.log(error);
    console.log(data);
}


app.get('/api/random-quote', function (req, res) {
    res.status(200).send(quoter.getRandomOne());
});

app.get('/api/analytics/getAll',function(req, res){
    
})

app.get('/api/advert/getPositionAdverts', function (req, res) {
    var userLong, userLat, uniqueId, date;
    userLong = req.query.longitude;
    userLat = req.query.latitude;
    uniqueId = req.query.uniqueId;
    date = req.query.date;
    var result = [];
    var adverts = advertHelper.getAdverts();
    if (adverts == undefined) {
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
                    advertHelper.setAdverts(data)
                    result = getItemsFromDataForGeolocation(data, userLong, userLat, uniqueId, date)
                    res.status(200).send(result);
                }
            })
    }
    else{
        console.log('cache advers returned')
            result = getItemsFromDataForGeolocation(adverts, userLong, userLat, uniqueId, date)
            res.status(200).send(result);
    }
})

function getAdvertAnalytics(name) {
    var promise = new Promise(function (resolve, reject) {
        client.getEntity(tableAnalytics, partitionKeyAnalytics, name, [], function (error, data) {
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

function addAnalyticalData(name, userLong, userLat, uniqueId, date){
    //var analytics = getAdvertAnalytics(name);
    var analytics = [];
    var analytic = { name: name, longitude: userLong, latitude: userLat, uniqueId: uniqueId, date: date }
    getAdvertAnalytics(name).then(
        function(data){
             analytics = data;
             analytics.push(analytic);
              var entity = new Entity(partitionKeyAnalytics, name, JSON.stringify(analytics));
              //update exisitng one
                client.updateEntity(tableAnalytics, entity ,{force: true}, function(error, data){
                    console.log(error);
                    console.log(data);
                    if(error != undefined){
                        console.log(error);
                        return false;
                    }
                    if(data != undefined){
                        return true;
                    }
                });

        }, 
        function(error){
            console.log(error);
            //insert a new name 
             analytics.push(analytic);
              var entity = new Entity(partitionKeyAnalytics, name, JSON.stringify(analytics));
                client.insertEntity(tableAnalytics, entity ,{force: true}, function(error, data){
                    console.log(error);
                    console.log(data);
                    if(error != undefined){
                        console.log(error);
                        return false;
                    }
                    if(data != undefined){
                        return true;
                    }
                });
        }
    )
}

function getItemsFromDataForGeolocation(data, userLongitude, userLatitude, uniqueId, date){
             if (data != null && data != undefined) {
                console.log(data);
                var result = [];

                data.forEach(function (item) {
                    var jsonValue = JSON.parse(item.value1);
                    if (advertHelper.advertDateValid(jsonValue.startdate, jsonValue.enddate) && advertHelper.advertInLocation(userLongitude,userLatitude, jsonValue.longitude, jsonValue.latitude)) {
                        jsonValue.__etag = item.__etag
                        addAnalyticalData(jsonValue.name, userLongitude, userLatitude, uniqueId, date);
                        result.push(jsonValue);
                    }
                })
                return result;
            }
}

app.get('/api/advert/getAdverts', function (req, res) {
    client.queryEntities(tableName, {
        query: azureTable.Query.create('PartitionKey', '==', partitionKey),
        limitTo: 100
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
        

  //   var tableValue = client.getEntity(tableName, partitionKey, name,[{metadata:"no"}] ,function(error, data){
  //   console.log(error);
  //   console.log(data);
  //   if(error != undefined){
  //     res.status(200).send(error);
  //   }

  //   if(data != undefined){
  //      res.status(200).send(data.value1);
  //   }
  // });




