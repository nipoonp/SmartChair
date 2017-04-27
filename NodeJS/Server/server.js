/**
 * Created by nipoonnarendra.TRN on 1/2/2017.
 */
var http = require("http");
var fs = require("fs");
var bodyParser = require('body-parser')

var express = require('express');
var app = express();
app.use(express.static('public'));

var configJSON;
var logger;

// parse application/json
app.use(bodyParser.json())

var inJSON;

app.post('/sensorReadings/:s0/:s1/:s2/:s3/:s4', function (request,response) {
    var data = request.params;
    var s0 = data.s0;
    var s1 = data.s1;
    var s2 = data.s2;
    var s3 = data.s3;
    var s4 = data.s4;


	inJSON = { "s0" : s0, "s1" : s1, "s2" : s2, "s3" : s3, "s4" : s4}













    logger.info("/sensorReadings POST was called");
    response.send("/sensorReadings POST was called");
});

app.get('/sensorReadings', function (request,response) {
    logger.info("/sensorReadings GET was called");
    response.send(inJSON);
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