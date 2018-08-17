const db = require('./web/JS/userMongoFunctions.js');

// =================================================
// var express = require('express');
// var app = express();
// var server = app.listen(process.env.PORT || 3000);
// var io = require('socket.io').listen(server);
// =================================================

var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(process.env.PORT || 3000);  //listen on port 80

let HTML_PATH = '/web/HTML/';
let HTML_SHAREDPATH = '/web/HTML/shared/';

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
app.get('/shared/menubar.html', function (req, res) {
    res.sendFile(__dirname + HTML_SHAREDPATH + 'menubar.html');
});
app.get('/shared/right_panel_cal.html', function (req, res) {
    res.sendFile(__dirname + HTML_SHAREDPATH + 'right_panel_cal.html');
});
app.get('/shared/select_hours.html', function (req, res) {
    res.sendFile(__dirname + HTML_SHAREDPATH + 'select_hours.html');
});
app.get('/share/:code', function(req, res) {
    let code = req.params.code;
    // client.setCode(code);
    res.render(__dirname + HTML_PATH + 'selectTimesFromCode.html', {code:code});
    console.log("code is " + code);
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

