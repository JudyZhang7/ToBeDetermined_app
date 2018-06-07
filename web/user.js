var User = require('./access_mongoDB.js');

//delete all users from database
// User.remove({}, function (err) {});

var newUser = new User({
    name: 'starlord55',
    code: '',
    calendar: [[true, true, false], [true, true, true], [false, false, true]],
    newCalendar: true
});

//check if code exists
if(newUser.newCalendar == true){
    console.log('trying to get new code...');
    newUser.getUniqueCode(function(err, code){
        console.log("New code is : " + code);
        if(err) throw err;
        console.log("New code is : " + code);
    });
    newUser.createJoinCal(function(err){
        console.log('Join Calendar has been created');
        if (err) throw err;
        console.log('Join Calendar has been created');
    });
    newUser.save(function(err){
        if(err) throw err;
        console.log('user saved successfully');
    })
}
else {
    User.find({name: 'JoinCalendar', code: newUser.code}, function(err, user){
        if (err) throw err;
        if(user == ""){
            console.log("Code [" + newUser.code + "] not found.");
            //try again
        }
        else{
            console.log("Code [" + newUser.code + "] is found!");
            newUser.save(function(err){
                if(err) throw err;
                console.log('user saved successfully');
            });
            //update join calendar
            newUser.updateCal(function(err){
                if(err) throw err;
                console.log('user saved successfully');
            });
        }
    });
}

console.log("[END]");