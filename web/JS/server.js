const db = require('./user.js');


var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    // res.sendfile(__dirname + '/selectTimes.html');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });

    socket.on('saveUser', function (userObject) {
        let user = JSON.parse(userObject);
        db.addNewUser(user.name, user.event, user.cal, socket);
    });

    //retrieve user by code
    socket.on('getUser', function (code){
        db.getUser(code, socket);
    })
});