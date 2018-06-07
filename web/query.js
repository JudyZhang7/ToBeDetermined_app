var User = require('./access_mongoDB.js');
// get all the users
User.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
});

// get the user starlord55
var userToFind = "starlord55"
User.find({ name: userToFind }, function(err, user) {
    if (err) throw err;
    if(user == ""){
        console.log("User [" + userToFind + "] not found.");
    }
    else{
        // object of the user
        console.log("user " + user);
    }
});
console.log("[END]");