// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";
//
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// });

//this is a collection, the same as a "table" in mySQL
// MONGODB
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
//
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = { name: "Company Inc", address: "Highway 37" };
//     //customers does not exist, but mongoDB will create it for you
//     dbo.collection("customers").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

//using mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/calDB', function (err, db) {
    if (err) throw err;
}); //connect to mongoDB database

var Schema = mongoose.Schema;

var userSchema = new Schema({
    code: {type: String},
    calendarName: {type: String},
    name: {type: String, required: true},
    newCalendar: {type: Boolean, required: true},
    calendar: {type: Array, required: true}
});

userSchema.methods.createJoinCal = function () {
    var cal = new User({
        code: this.code,
        name: 'JoinCalendar',
        calendarName: this.calendarName,
        calendar: this.calendar,
        newCalendar: false
    });
    cal.save(function (err) {
        if (err) throw err;
        console.log('mainCalendar saved successfully');
    });
};

userSchema.pre('save', function (next) {
    //before save, define
    new Promise((setUniqueCode) => {
        getCode(setUniqueCode);
    }).then((result) => {
        //This will call if your algorithm succeeds!
    });
    next();
});

/* come up with unique code, get it checked, if thrown error, try another code and get it checked
 if approved, set code
*/

function getCode(resolve) {
    //If you're using NodeJS you can use Es6 syntax:
    getUniqueCode().then(
        function(code) {
            User.find({code: code}, (users) => {
                if (users.error()) {
                    console.error(users.error());
                } else {
                    //If your operation succeeds, resolve the promise and don't call again.
                    if (users.length) {
                        getCode(resolve); //Try again
                    } else {
                        this.resolve(users); //Resolve the promise, pass the result.
                    }
                }
            })
        })
}

/*
 * Please note that "(...) => {}" equivals to "function(...){}"
 */

function getUniqueCode(){
    var randomstring = require("randomstring");
    randomstring.generate({length: 5, charset: 'alphanumeric'});
    return randomstring;
}

userSchema.methods.setUniqueCode = function (uniqueCode) {
    this.code = this.code + uniqueCode;
    console.log("Successfully assigned [" + this.code + "] code to " + this.name);
    this.createJoinCal();
    return this.code;
}

userSchema.methods.updateCal = function () {
    //find calendar with the correct code
    console.log(this.calendar.length);
    var joinCal = User.find({code: this.code, name: 'JoinCalendar'}, function (err, users) {
        if (err) throw err;
        // object of all the users
        console.log(users);
    });
    console.log("Joined calendar: " + joinCal.name + this.code + 'JoinCalendar');

    for (var week = 0; week < this.calendar.length; week++) {
        var thisWeek = this.calendar[week];
        for (var day = 0; day < thisWeek.length; day++) {
            if (thisWeek[day] == false) {
                joinCal.calendar[week][day] = false;
            }
        }
    }
};

//create a model using it
var User = mongoose.model('User', userSchema);
module.exports = User; //make available to users in Node application
console.log("[END]");