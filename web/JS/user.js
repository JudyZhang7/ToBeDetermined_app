var User = require('./access_mongoDB.js');

//delete all users from database
// User.remove({}, function (err) {});

//timesAvailable is a 2D array of times available
function addNewUser(_user, socket){
    let _code = _user.code;
    let _calendarName = _user.calendarName;
    let _name = _user.name;
    let _days = _user.days;
    let _newCalendar = _user.newCalendar;
    let _calendar = _user.calendar;

    console.log("name: " + _name + " event: " + _calendarName + " timesAvailable: " + _calendar);
    let days = _calendar.length;
    let hours = _calendar[0].length;
    let cal = [];
    for(let i = 0; i < days; i++){
        for(let j = 0; j < hours; j++){
            var entry = {days: i, hour: j, available: _calendar[i][j]};
            cal.push(entry);
        }
    }

    var newUser = new User({
        code: _code,
        calendarName: _calendarName,
        name: _name,
        days: _days,
        hours: hours,
        newCalendar: _newCalendar,
        calendar: cal,
    })

    newUser.save(function(err, obj){
        if(err) {
            console.log(err.message); //does not save
            console.log('user not saved successfully');
        }
        else{
            console.log('user saved successfully. Code is: ' + obj.code);
            socket.emit('code', obj.code);
        }
    })
}

function getUser(code, socket){
    User.findOne({code: code}, function(err, result) {
        if (err) throw err;
        if(result === null) {
            socket.emit('codeValidation', false);
        } else{
            socket.emit('codeValidation', true);
        }
    });
}

//code is guaranteed to exist
function getUserCal(code, socket){
    User.findOne({code: code, name: 'JoinCalendar'}, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        socket.emit('userCal', result);
    });
}

module.exports = {
    addNewUser,
    getUser,
    getUserCal
}
// var newUser = new User({
//     name: 'starlord55',
//     code: 'jkSN7',
//     days: 2,
//     hours: 4,
//     calendar: [ {day: 1, hour: 1, available: true},
//                 {day: 1, hour: 2, available: true},
//                 {day: 1, hour: 3, available: true},
//                 {day: 1, hour: 4, available: true},
//                 {day: 2, hour: 1, available: true},
//                 {day: 2, hour: 2, available: true},
//                 {day: 2, hour: 3, available: true},
//         {day: 2, hour: 4, available: true}],
//     newCalendar: true
//
// });
//
// var newUser = new User({
//     name: 'gamora69',
//     code: 'jkSN7',
//     days: 2,
//     hours: 4,
//     calendar: [ {day: 1, hour: 1, available: false},
//                 {day: 1, hour: 2, available: false},
//                 {day: 1, hour: 3, available: false},
//                 {day: 1, hour: 4, available: false},
//                 {day: 2, hour: 1, available: false},
//                 {day: 2, hour: 2, available: false},
//                 {day: 2, hour: 3, available: false},
//         {day: 2, hour: 4, available: false}],
//     newCalendar: false
// });
//
// newUser.save(function(err){
//     if(err) {
//         console.log(err.message); //does not save
//         console.log('user not saved successfully');
//     }
//     else{
//         console.log('user saved successfully');
//     }
// })

