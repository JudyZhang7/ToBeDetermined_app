var User = require('./access_mongoDB.js');

//delete all users from database
// User.remove({}, function (err) {});

//timesAvailable is a 2D array of times available
function addNewUser(_name, _event, _timesAvailable){
    console.log("name: " + _name + " event: " + _event + " timesAvailable: " + _timesAvailable);
    let days = _timesAvailable.length;
    let hours = _timesAvailable[0].length;
    let cal = [];
    for(let i = 0; i < days; i++){
        for(let j = 0; j < hours; j++){
            var entry = {days: i, hour: j, available: _timesAvailable[i][j]};
            cal.push(entry);
        }
    }

    var newUser = new User({
        name: _name,
        calendarName: _event,
        days: days,
        hours: hours,
        calendar: cal,
        newCalendar: true
    })

    newUser.save(function(err){
        if(err) {
            console.log(err.message); //does not save
            console.log('user not saved successfully');
        }
        else{
            console.log('user saved successfully');
        }
    })
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

module.exports = {
    addNewUser,
}


//check if code exists
// if(newUser.newCalendar == true){
//     console.log('trying to get new code...');
//     newUser.getUniqueCode(function(err, code){
//         console.log("New code is : " + code);
//         if(err) throw err;
//         console.log("New code is : " + code);
//     });
//     newUser.createJoinCal(function(err){
//         console.log('Join Calendar has been created');
//         if (err) throw err;
//         console.log('Join Calendar has been created');
//     });
//     newUser.save(function(err){
//         if(err) throw err;
//         console.log('user saved successfully');
//     })
// }
// else {
//     User.find({name: 'JoinCalendar', code: newUser.code}, function(err, user){
//         if (err) throw err;
//         if(user == ""){
//             console.log("Code [" + newUser.code + "] not found.");
//             //try again
//         }
//         else{
//             console.log("Code [" + newUser.code + "] is found!");
//             newUser.save(function(err){
//                 if(err) throw err;
//                 console.log('user saved successfully');
//             });
//             //update join calendar
//             newUser.updateCal(function(err){
//                 if(err) throw err;
//                 console.log('user saved successfully');
//             });
//         }
//     });
// }

