/**
 * Created by nipoonnarendra.TRN on 1/2/2017.
 */
var http = require("http");
var fs = require("fs");
var bodyParser = require('body-parser')

var express = require('express');
var app = express();
app.use(express.static('public'));

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

var configJSON;
var logger;

// parse application/json
app.use(bodyParser.json())

inJSON = {"s0" : 0, "s1" : 0, "s2" : 0, "s3" : 0, "s4" : 0};

app.post('/sensorReadings/:s0/:s1/:s2/:s3/:s4', function (request,response) {
    var data = request.params;
    var s0 = data.s0;
    var s1 = data.s1;
    var s2 = data.s2;
    var s3 = data.s3;
    var s4 = data.s4;

	inJSON = {"s0" : s0, "s1" : s1, "s2" : s2, "s3" : s3, "s4" : s4};


    //We need to work with "MongoClient" interface in order to connect to a mongodb server.
    var MongoClient = mongodb.MongoClient;

    // Connection URL. This is where your mongodb server is running.
    var url = configJSON.database.mongodbURL + configJSON.database.databaseName;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            logger.info('Connection established to', url);

            // Get the documents collection
            var collection = db.collection(configJSON.database.collectionName);

            // Insert some users
            collection.insert(inJSON, function (err, result) {
                if (err) {
                    logger.error(err);
                } else {
                    logger.info('Inserted new reading!');
                }
                //Close connection
                db.close();
            });
        }
    });









    logger.info("/sensorReadings POST was called");
    response.send("/sensorReadings POST was called");
});

app.get('/sensorReadings', function (request,response) {
    logger.info("/sensorReadings GET was called");
    //response.setHeader('Content-Type', 'application/json');
    response.json(inJSON);
});

app.listen(8099, function () {


    var path = require('path');
    var configPath = './public/config/config.json';
    var correctedPath = path.normalize(configPath);
    configJSON = require(__dirname + path.sep + correctedPath);


    var mkdirp = require('mkdirp');
    mkdirp(__dirname + path.sep + 'logs', function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });

    var log4js = require('log4js');
    log4js.loadAppender(configJSON.log4js.loadAppenderType);
    log4js.addAppender(log4js.appenders.file(configJSON.log4js.path), configJSON.log4js.loggerName);
    logger = log4js.getLogger(configJSON.log4js.loggerName);
    logger.setLevel(configJSON.log4js.level);


    logger.info('Server running...');
    logger.info(configJSON);
});