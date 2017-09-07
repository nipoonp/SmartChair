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



app.get('/dashBoardLineChart/:userID', function (request,response) {
	var data = request.params;
	var userID = data.userID;

	var sql = "SELECT Posture,Time FROM SensorReadings WHERE userID = " + userID + " AND posture IS NOT NULL ORDER BY TIME DESC LIMIT 100;";

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
    	var posture_values = [result.length];
    	var time_values = [result.length];

    		for (i = 0; i < result.length; i++){

    			posture_values[i] = result[i].Posture
				time_values[i] = result[i].Time

    		}

    		console.log(posture_values);
    		console.log(time_values);

    response.json({"posture_values": posture_values, "time_values": time_values})

    });

    con.end();

});


app.get('/dashBoardPosturePercentageChart/:userID', function (request,response) {
    var data = request.params;
    var userID = data.userID;

    var sql = "SELECT Posture FROM SensorReadings WHERE userID = " + userID + " AND posture=10 OR posture=11;";

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
        var good_pos_cont = result.length;

        console.log(result.length);

        sql = "SELECT Posture FROM SensorReadings WHERE userID = " + userID + " AND posture!=10 OR posture!=11;";
        con.query(sql, function (err, result) {

            if (err) throw err;
            var bad_pos_cont = result.length;

            console.log(result.length);

            response.json({"good_pos_cont": good_pos_cont, "bad_pos_cont": bad_pos_cont});
            con.end();
        });
    });
});

app.get('/userInfo/:userID', function (request,response) {
	var data = request.params;
	var userID = data.userID;

	response.json({"firstName" : "Nipoon","lastName" : "Patel","userID" : 1024, "chairID" : 2010})
});

app.get('/getNotifications/:id', function (request,response){

	var data  = request.params;
	var good_posture_time;
    var bad_posture_time;
	var id = data.id;
	// var sql = "select Posture from PostureAlert.SensorReadings where Posture != 'NULL' and UserID = '" + id + "' order by time desc limit 1;"

    var start = new Date();
    start.setHours(0,0,0,0);

    var startOfDay = start.getTime()/1000;

    var sql = "SELECT COUNT(Posture) AS good_cnt FROM SensorReadings WHERE UserID = " + id + " AND (Posture = 10 OR Posture = 11) AND Time > " + startOfDay + ";";

// timeStamp = 340958330;

// SELECT COUNT(*) FROM SensorReadings WHERE USERID = id AND POSTURE = 10 OR POSTURE = 11 AND time > timeSamp; //good pos count
// SELECT COUNT(*) FROM SensorReadings WHERE USERID = id AND POSTURE != 10 OR POSTURE != 11 AND POSTURe != NULL AND POSTURE != 0; //bad pos count

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
        good_posture_time = result[0].good_cnt;

        sql = "SELECT COUNT(Posture) AS bad_cnt FROM SensorReadings WHERE UserID = " + id + " AND (Posture != 10 AND Posture != 11 AND Posture != 0 AND Posture IS NOT NULL) AND Time > " + startOfDay + ";";
        con.query(sql, function (err, result) {

            if (err) throw err;
            bad_posture_time = result[0].bad_cnt;

            console.log("good_posture_time " + good_posture_time + " bad_posture_time " + bad_posture_time)
            response.json({"good_posture_time": good_posture_time, "bad_posture_time": bad_posture_time});
            con.end();
        });
	
	});

    




});

app.post('/loginUser/:email/:password', function(request,response){

	var data = request.params;

	var email = data.email;
	var password = data.password;
	var sql = "SELECT FirstName, LastName, UserID, Email, Weight, Height, Password FROM PostureAlert.Users WHERE Email = '" + email + "'" + ";";


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
			throw error;

		} else{
			
			try{
				
				if(password.localeCompare(result[0].Password) == 0){
                    sql = "UPDATE Chairs SET UserID = " + result[0].UserID +  " WHERE ChairID = 1000;";

                    con.query(sql, function (err, result) {
                         if (err) throw err;

                    });
                    con.end();
                    response.json({"status" : "0","fname":result[0].FirstName,"lname":result[0].LastName,"id":result[0].UserID,"email":result[0].Email,"weight":result[0].Weight,"height":result[0].Height,"password":result[0].Password}); // All good
 					

                } else{
                	con.end();
					response.json({"status" : "1"}); //User exists, but enters incorrect password
				}

			}
			catch(err){
				console.log(err);
				con.end();
				response.json({"status" : "2"}); //Email doesnt exist, user needs to register

			}

		}

	});

		

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
			response.send({"status":"0"}); //query not possible if user already exists
			console.log("Status 0");
		} else{
			response.send({"status":"1"});
			console.log("Status 1");
		}
	
	});

	con.end();	

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
    // var readingID = result[0].ReadingID;
    // console.log(readingID);

    var averages2s3 = (result[0].S2 + result[0].S3)/2;

        var sql = "INSERT INTO SensorReadings (S0, S1, S2, S3, S4, S5, S6, S7, Posture, UserID, ChairID, Time) VALUES ?"; 
        if (posture == 11){
            var values = [
                [0,0,0,0,0,0,0,0,0,userID,result[0].ChairID,result[0].Time], //0
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,0,0,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,0,0,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,0,0,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,0,0,9,userID,result[0].ChairID,result[0].Time], //9
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,10,userID,result[0].ChairID,result[0].Time], //10
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,11,userID,result[0].ChairID,result[0].Time], //11

                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,1024,1024,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,1024,1024,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,1024,1024,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,1024,1024,9,userID,result[0].ChairID,result[0].Time], //9



                [0,0,0,0,0,0,0,0,0,userID,result[0].ChairID,result[0].Time], //0
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,0,0,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,0,0,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,0,0,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,0,0,9,userID,result[0].ChairID,result[0].Time], //9
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,10,userID,result[0].ChairID,result[0].Time], //10
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,11,userID,result[0].ChairID,result[0].Time], //11

                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,1024,1024,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,1024,1024,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,1024,1024,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,1024,1024,9,userID,result[0].ChairID,result[0].Time], //9



                [0,0,0,0,0,0,0,0,0,userID,result[0].ChairID,result[0].Time], //0
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,0,0,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,0,0,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,0,0,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,0,0,9,userID,result[0].ChairID,result[0].Time], //9
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,10,userID,result[0].ChairID,result[0].Time], //10
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,11,userID,result[0].ChairID,result[0].Time], //11

                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,1024,1024,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,1024,1024,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,1024,1024,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,1024,1024,9,userID,result[0].ChairID,result[0].Time], //9



                [0,0,0,0,0,0,0,0,0,userID,result[0].ChairID,result[0].Time], //0
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,0,0,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,0,0,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,0,0,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,0,0,9,userID,result[0].ChairID,result[0].Time], //9
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,10,userID,result[0].ChairID,result[0].Time], //10
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,11,userID,result[0].ChairID,result[0].Time], //11

                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,1024,1024,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,1024,1024,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,1024,1024,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,1024,1024,9,userID,result[0].ChairID,result[0].Time], //9



                [0,0,0,0,0,0,0,0,0,userID,result[0].ChairID,result[0].Time], //0
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,0,0,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,0,0,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,0,0,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,0,0,9,userID,result[0].ChairID,result[0].Time], //9
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,0,0,10,userID,result[0].ChairID,result[0].Time], //10
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,result[0].S6,result[0].S7,11,userID,result[0].ChairID,result[0].Time], //11

                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,0,1024,1024,1,userID,result[0].ChairID,result[0].Time], //1
                [0,0,0,0,900,900,1024,1024,2,userID,result[0].ChairID,result[0].Time], //2
                [0,0,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,3,userID,result[0].ChairID,result[0].Time], //3
                [0,result[0].S1,averages2s3,averages2s3,result[0].S4,result[0].S5,1024,1024,4,userID,result[0].ChairID,result[0].Time], //4
                [result[0].S0,result[0].S1,averages2s3,averages2s3,0,result[0].S5,1024,1024,8,userID,result[0].ChairID,result[0].Time], //8
                [result[0].S0,result[0].S1,averages2s3,averages2s3,result[0].S4,0,1024,1024,9,userID,result[0].ChairID,result[0].Time], //9



            ];
        } else if (posture == 6){
            var values = [
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,0,0,7,userID,result[0].ChairID,result[0].Time], //7
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,1024,1024,7,userID,result[0].ChairID,result[0].Time], //7


                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,0,0,7,userID,result[0].ChairID,result[0].Time], //7
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,1024,1024,7,userID,result[0].ChairID,result[0].Time], //7


                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,0,0,7,userID,result[0].ChairID,result[0].Time], //7
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,1024,1024,7,userID,result[0].ChairID,result[0].Time], //7


                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,0,0,7,userID,result[0].ChairID,result[0].Time], //7
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,1024,1024,7,userID,result[0].ChairID,result[0].Time], //7


                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,0,0,7,userID,result[0].ChairID,result[0].Time], //7
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,6,userID,result[0].ChairID,result[0].Time], //6
                [0,result[0].S1,result[0].S3,result[0].S2,result[0].S5,result[0].S4,1024,1024,7,userID,result[0].ChairID,result[0].Time], //
            ];
        } else if (posture == 5){
            var values = [
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,5,userID,result[0].ChairID,result[0].Time], //5
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,5,userID,result[0].ChairID,result[0].Time], //5

                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,5,userID,result[0].ChairID,result[0].Time], //5
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,5,userID,result[0].ChairID,result[0].Time], //5

                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,5,userID,result[0].ChairID,result[0].Time], //5
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,5,userID,result[0].ChairID,result[0].Time], //5

                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,5,userID,result[0].ChairID,result[0].Time], //5
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,5,userID,result[0].ChairID,result[0].Time], //5

                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,0,0,5,userID,result[0].ChairID,result[0].Time], //5
                [result[0].S0,result[0].S1,result[0].S2,result[0].S3,result[0].S4,result[0].S5,1024,1024,5,userID,result[0].ChairID,result[0].Time], //5
            ];
        }

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
    var s2 = data.s2*5;
    var s3 = data.s3*5;
    var s1 = data.s1;
    var s5 = data.s5;
    var s4 = data.s4;
    var s6 = data.s6;
    var s7 = data.s7;
    var chairID = data.chairID;

    if (s2 < 20){
        s2 = 0;
    }

    if (s3 < 20){
        s3 = 0;
    }

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

	var userID
;
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