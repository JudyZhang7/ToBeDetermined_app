const db = require('./user.js');


var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    // res.sendfile(__dirname + '/selectTimes.html');
});

io.on('connection', function (socket) {
    console.log("server listening on port 3000");
    socket.emit('news', { hello: 'world' });

    socket.on('saveUser', function (userObject) {
        var user = JSON.parse(userObject);
        db.addNewUser(user.name, user.event, user.cal);
        // console.log(userObject);
    });
});