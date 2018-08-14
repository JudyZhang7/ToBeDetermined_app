const db = require('./userMongoFunctions.js');


var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    // res.sendfile(__dirname + '/selectTimes.html');
});

io.on('connection', function (socket) {

    socket.on('saveUser', function (userObject) {
        let user = JSON.parse(userObject);
        db.addNewUser(user, socket);
    });

    //check if user exists by code
    socket.on('getUser', function (code){
        db.getUser(code, socket);
    })
    //retrieve user by code
    socket.on('getUserCal', function (code){
        db.getUserCal(code, socket);
    })
    //retrieve all contributers
    socket.on('getContributors', function(code){
        db.getContributors(code, socket);
    })
});