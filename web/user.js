var User = require('./access_mongoDB.js');

var judy = new User({
    code: 'PX42L',
    name: 'Lance',
    calendar: [[true, true, false], [true, true, true], [false, false, true]]
});

// judy.dudify(function(err, name){
//     if (err) throw err;
//     console.log('Dudified name is: ' + name);
// })

// save puts it in the database and you can't have more than one judy! ;)
judy.save(function(err){
    if(err) throw err;
    console.log('user saved successfully');
})

// get all the users
User.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
});

// get the user starlord55
var userToFind = 'starlord55'
User.find({ username: userToFind }, function(err, user) {
    if (err) throw err;
    if(user == ""){
        console.log("User [" + userToFind + "] not found.");
    }
    else{
        // object of the user
        console.log("user " + user);
    }
});