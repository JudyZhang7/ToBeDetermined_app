const db = require('./web/JS/userMongoFunctions.js');


var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);

let HTML_PATH = '/web/HTML/';

var distDir = __dirname + "/web/";
app.use(express.static(distDir));

app.get('/', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'index.html');
});
app.get('/create.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'create.html');
});
app.get('/done.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'done.html');
});
app.get('/getcode.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'getCode.html');
});
app.get('/selecttimes.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'selectTimes.html');
});
app.get('/selecttimesfromcode.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'selectTimesFromCode.html');
});
app.get('/viewcalendar.html', function (req, res) {
    res.sendFile(__dirname + HTML_PATH + 'viewcalendar.html');
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