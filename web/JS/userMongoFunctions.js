var UserMongoFunctions = require('./access_mongoDB.js');

//timesAvailable is a 2D array of times available
function addNewUser(_user, socket){
    try {
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
        for (let i = 0; i < days; i++) {
            for (let j = 0; j < hours; j++) {
                let entry = {days: i, hour: j, available: _calendar[i][j]};
                cal.push(entry);
            }
        }

        let newUser = new UserMongoFunctions({
            code: _code,
            calendarName: _calendarName,
            name: _name,
            days: _days,
            hours: hours,
            newCalendar: _newCalendar,
            calendar: cal,
        });

        newUser.save(function (err, obj) {
            if (err) {
                console.log(err.message); //does not save
                console.log('user not saved successfully');
            }
            else {
                console.log('user saved successfully. Code is: ' + obj.code);
                socket.emit('code', obj.code);
            }
        });

    } catch(er){
        console.log("[Error within addNewUser function...]");
    }
}

function getUser(code, socket){
    try {
        UserMongoFunctions.findOne({code: code}, function (err, result) {
            // if (err) throw err;
            if (result === null) {
                socket.emit('codeValidation', false);
            } else {
                socket.emit('codeValidation', true);
            }
        });
    } catch(er){
        console.log("[Error within getUser function...]");
        socket.emit('codeValidation', false);
    }
}

function doesUserExist(code, cb){
    try {
        UserMongoFunctions.findOne({code: code}, function (err, result) {
            // if (err) throw err;
            if (result === null) {
                cb(false);
            } else{
                cb(true);
            }
        });
    } catch(er){
        console.log("[Error within getUser function...]");
    }
}

//code is guaranteed to exist
function getUserCal(code, socket){
    try {
        UserMongoFunctions.findOne({code: code, name: 'JoinCalendar'}, function (err, result) {
            // if (err) throw err;
            console.log("RESULT FROM: " + result.name + "\n" + result);
            socket.emit('userCal', result);
        });
    } catch(er){
        console.log("[Error within getUserCal function...]");
    }
}

function getContributors(code, socket){
    try {
        UserMongoFunctions.find({code: code, name: {$ne: 'JoinCalendar'}}, {name: 1, _id: 0}, function (err, result) {
            // if (err) throw err;
            console.log("GOT THE CONTRIBUTORS USER MONGO FUNCTIONS " + result);
            socket.emit('contributers', result);
        });
    } catch(er){
        console.log("[Error within getContributors function...]");
    }
}

module.exports = {
    addNewUser,
    getUser,
    getUserCal,
    getContributors,
    doesUserExist
};