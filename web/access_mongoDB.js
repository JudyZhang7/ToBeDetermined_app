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

//define cool methods like formatting, hashing passwords etc.
userSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    next();
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

userSchema.pre('save', function(next) {
    //before save, define
    if (this.newCalendar == true){
        //call function uniqueCode and callback function for uniqueCode is setUniqueCode
        uniqueCode(function(err, code){
            if(err) throw err;
            setUniqueCode(code);
        });
    }
    else{

    }
    next();
});

/* come up with unique code, get it checked, if thrown error, try another code and get it checked
 if approved, set code
*/

function uniqueCode() {
    var randomstring = require("randomstring");
    var uniqueCode = "";
    uniqueCode = "dsKNs";
    // uniqueCode = randomstring.generate({length: 5, charset: 'alphanumeric'});

    approvedOf(uniqueCode, function(err, errormsg){
        if(err) {
            console.log(errormsg);
        }


    });
    // console.log("in getUniqueCode function: uniqueCode is: [" + uniqueCode + "]");
    // User.count({}, function (err, count) {
    //     if (err) throw err;
    //     console.log("Number of users:", count);
    // })
    return uniqueCode;
};
function approvedOf(uniqueCode, callback) {
    var notUniqueError = new Error('Code is not unique.');
    User.find({code: uniqueCode}, function (err, users) {
        if (err) throw err;
        if (users.length) {
            console.log(users.length + " ... so not approved!");
            callback(notUniqueError, 'not unique!'); // I send my error as the first argument.
            return false;
        }
        else {
            console.log(users.length + " ... so approved!");
            callback(null, 'unique!'); // I send my error as the first argument.
            return true;
        }
    })
}
userSchema.methods.setUniqueCode = function (uniqueCode){
    this.code = this.code + uniqueCode;
    console.log("Successfully assigned [" + this.code + "] code to " + this.name);
    createJoinCal();
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