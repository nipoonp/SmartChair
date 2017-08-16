/**
 * Created by nipoonnarendra.TRN on 1/2/2017.
 */
var http = require("http");
var fs = require("fs");
var bodyParser = require('body-parser')

var express = require('express');
var app = express();
app.use(express.static('public'));
var mysql = require('mysql');
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

var configJSON;
var logger;

// parse application/json
app.use(bodyParser.json())

inJSON = {"s0" : 0, "s1" : 0, "s2" : 0, "s3" : 0, "s4" : 0, "s5" : 0, "s6" : 0, "s7" : 0};

app.get('/dashBoardPieChart/:userID', function (request,response) {
	var data = request.params;
	var userID = data.userID;


    var userID;
    var pos_array = [0,0,0,0,0,0,0,0,0,0,0,0];
    var sql = "SELECT Posture FROM SensorReadings WHERE UserID = " + userID + " AND Posture IS NOT NULL;";

    var con = mysql.createConnection({
      host: "13.55.201.70",
      user: "root",
      password: "12345678",
      database: "PostureAlert"
    });


    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });


    con.query(sql, function (err, result) {
    if (err) throw err;
    
        for (i = 0; i < result.length; i++){
        	
            switch(result[i].Posture) {
                case 0:
                    pos_array[0] = pos_array[0] + 1;
                    break;
                case 1:
                    pos_array[1] = pos_array[1] + 1;
                    break;
                case 2:
                    pos_array[2] = pos_array[2] + 1;
                    break;
                case 3:
                    pos_array[3] = pos_array[3] + 1;
                    break;
                 case 4:
                    pos_array[4] = pos_array[4] + 1;
                    break;
                case 5:
                    pos_array[5] = pos_array[5] + 1;
                    break;
                case 6:
                    pos_array[6] = pos_array[6] + 1;
                    break;
                case 7:
                    pos_array[7] = pos_array[7] + 1;
                    break;
                case 8:
                    pos_array[8] = pos_array[8] + 1;
                    break;
                case 9:
                    pos_array[9] = pos_array[9] + 1;
                    break;
                case 10:
                    pos_array[10] = pos_array[10] + 1;
                    break;
                case 11:
                    pos_array[11] = pos_array[11] + 1;
                    break;                  
                default:
                    //code block
           }
        }
    
    
	console.log(pos_array);
	    
    response.json({"E" : pos_array[0],"LU" : pos_array[1],"SF" : pos_array[2],"LF" : pos_array[3],"SS" : pos_array[4],"SB" : pos_array[5],"LL" : pos_array[6],"LR" : pos_array[7],"LC" : pos_array[8],"RC" : pos_array[9],"NA" : pos_array[10],"PP" : pos_array[11]})

    });

    con.end();

});

app.get('/userInfo/:userID', function (request,response) {
	var data = request.params;
	var userID = data.userID;

	response.json({"firstName" : "Nipoon","lastName" : "Patel","userID" : 1024, "chairID" : 2010})
});

app.post('/registerUser/:fname/:lname/:email/:weight/:height/:password', function(request,response){

	var data = request.params;

	var fname = data.fname;
	var lname = data.lname;
	var email = data.email;
	var weight = data.weight;
	var height = data.height;
	var password = data.password;
	var id = Math.floor(Math.random() * 10000000) + 1

	var sql = "INSERT INTO Users (FirstName, LastName, UserID, Email, Weight, Height, Password) VALUES (" + "'" + fname + "'" + ", " + "'" + lname + "'" + ", " + "'" + id + "'" + "," + "'" + email + "'" + "," + "'" + weight + "'" + "," + "'" + height + "'" + "," + "'" + password + "'" + ");";

	var con = mysql.createConnection({
	  host: "13.55.201.70",
	  user: "root",
	  password: "12345678",
	  database: "PostureAlert"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	});


	con.query(sql, function (err, result) {
		if (err){
			response.send({"status":"0"});
			console.log("Status 0");
		} else{
			response.send({"status":"1"});
			console.log("Status 1");
		}
	
	});	

	
	

});




app.post('/trainData/:userID/:posture/:time', function (request,response) {
    var data = request.params;
    var userID = data.userID;
    var posture = data.posture;
    var time = data.time;


    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "PostureAlert"
    });

    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });


    var sql = "SELECT * FROM SensorReadings WHERE UserID = " + userID + " AND Time <= " + time + " ORDER BY time DESC LIMIT 1;";
    con.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("Got back " + result[0].UserID);
    var readingID = result[0].ReadingID;
    console.log(readingID);

    var sql = "INSERT INTO SensorReadings (S0, S1, S2, S3, S4, S5, S6, S7, Posture, UserID, ChairID, Time) VALUES ?"; 
    var values = [
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],
        [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,posture,userID,result[0].ChairID,result[0].time],

    ];

            // var sql = "UPDATE SensorReadings SET Posture = " + posture + " WHERE ReadingID = " + readingID + ";";
        con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("New records edited!");
        con.end();
        });


    }); 

    


    logger.info("/userID " + userID + " posture " + posture + " time " + time );
    response.json({"status" : "success"})
});








app.post('/sensorReadings/:s0/:s1/:s2/:s3/:s4/:s5/:s6/:s7/:chairID', function (request,response) {
    var data = request.params;
    var s0 = data.s0;
    var s2 = data.s2;
    var s3 = data.s3;
    var s1 = data.s1;
    var s5 = data.s5;
    var s4 = data.s4;
    var s6 = data.s6;
    var s7 = data.s7;
    var chairID = data.chairID;


    var timeStamp = (new Date).getTime()/1000;

	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "12345678",
	  database: "PostureAlert"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	});

	var userID;

	var sql = "SELECT UserID FROM Chairs WHERE ChairID = " + chairID + ";";
	con.query(sql, function (err, result) {
	if (err) throw err;
	// console.log("Got back " + result[0].UserID);
	userID = result[0].UserID;

		var sql = "INSERT INTO SensorReadings (S0, S1, S2, S3, S4, S5, S6, S7, Posture, UserID, ChairID, Time) VALUES (" + s0 + ", " + s1 + ", " + s2 + ", " + s3 + ", " + s4 + ", " + s5 + ", " + s6 + ", " + s7 + ", " + "NULL" + ", " + userID + ", " + chairID + ", " + timeStamp + ");";
		con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("New record inserted");
        con.end();
		});
	});	

    

    logger.info(s0 + " " + s1 + " " + s2 + " " + s3 + " " + s4 + " " + s5 + " " + s6 + " " + s7 + " /sensorReadings POST was called");
    response.send("/sensorReadings POST was called");
});

app.get('/sensorReadings', function (request,response) {
    logger.info("/sensorReadings GET was called");
    //response.setHeader('Content-Type', 'application/json');
    response.json(inJSON);
});


app.get('/getReportStats',function (request,response) {

    logger.info("/getReportStats GET was called");
    var subscription;
    var outputStr = "";
    var MongoClient = require('mongodb').MongoClient;

    // Connect to the db
    MongoClient.connect(configJSON.database.mongodbURL + configJSON.database.databaseName, function (err, db) {

        db.collection(configJSON.database.collectionName, function (err, collection) {

            

            collection.find({
                "posture": "unoccupied"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "legs raised"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "sitting forward"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "leaning forward"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "lightly forward"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "leaning backwards"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "leaning left"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "leaning right"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "left crossed"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "good posture"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString() + ",";
            });

            collection.find({
                "posture": "perfect posture"
            }).toArray(function(err, items) {
                if(err) throw err;
                outputStr = outputStr + (items.length).toString();
        logger.info(outputStr);
        response.send(outputStr);
            });

        });
    });


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