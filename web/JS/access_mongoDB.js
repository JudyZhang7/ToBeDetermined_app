//using mongoose
let mongoose = require('mongoose');
mongoose.connect('mongodb://Judy:whenisgood1@ds121382.mlab.com:21382/tbd_db', function (err, db){
    if (err){
        console.log("[Database error... cannot connect... ]");
        throw err;
    }
}); //connect to mlab sandbox database

// mongoose.connect('mongodb://localhost/calDB', function (err, db) {
//     if (err) throw err;
// }); //connect to local database

let Schema = mongoose.Schema;

let userSchema = new Schema({
    code: {type: String},
    calendarName: {type: String},
    name: {type: String, required: true},
    hostname: {type: String, required: false},
    days: [{type: Number}],
    hours: {type: Number},
    newCalendar: {type: Boolean, required: true},
    calendar: [{
        day: Number,
        hour: Number,
        available: Boolean
    }]
});

userSchema.methods.createJoinCal = function () {
    let cal = new User({
        code: this.code,
        name: 'JoinCalendar',
        hostname: this.name,
        days: this.days,
        hours: this.hours,
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
    if (this.newCalendar === true) {
        // Assuming this is asynchronous
        this.getCode();
        console.log('in pre-save newCalendar');
    }
    else if ((this.newCalendar !== true) && (this.name !== "JoinCalendar")){
        console.log("[updating calendar... " + this.code + "]");
        this.updateCal(next);
    }
    next();
});

/* come up with unique code, get it checked, if thrown error, try another code and get it checked
 if approved, set code
*/
userSchema.methods.getCode = function() {
    function getUniqueCode(resolve) {
        let code = getNewUniqueCode(function( err, count){
            console.log( "unique code:" + count );
        });
        User.find({code: code}, function(err, users) {
            if (err) throw err;

            if (users.length){
                console.log("result was not null");
                getUniqueCode(resolve); //Try again
            } else {
                resolve(code); //Resolve the promise, pass the result.
            }
            // object of all the users
            console.log(users);
        });
    }

    new Promise((r) => {
        getUniqueCode(r);
    }).then((result) => {
        //This will call if your algorithm succeeds!
        console.log("result " + result);
        this.setUniqueCode(result);
    }).catch(error => {
        console.log(error);
    });
}

function getNewUniqueCode(){
    let randomstring = require("randomstring");
    // var code = '9ozuq';
    let code = randomstring.generate({length: 5, charset: 'alphanumeric'});
    console.log("Code is: " + code);
    return code;
}

userSchema.methods.setUniqueCode = function (uniqueCode) {
    this.code = uniqueCode;
    this.update({ $set: { code: uniqueCode }}).update(); // not executed
    this.update({ $set: { code: uniqueCode }}).exec(); // executed
    console.log("Successfully assigned [" + this.code + "] code to " + this.name);
    this.createJoinCal();
    return this.code;
}


userSchema.methods.updateCal = function (next) {
    //find calendar with the correct code
    //if no calendar with correct code
    var thisUser = this;
    console.log("Length of calendar for " + this.name + ": " + this.calendar.length);

    User.findOne({code: this.code, name: 'JoinCalendar'}, function (err, joinCal) {
        if (err) throw err;
        // object of all the users
        console.log(joinCal);
        // no users found
        if (joinCal == null) {
            // do stuff here
            let newError = new Error('That is not a valid code.');
            next(newError);
        } else{
            console.log("Joined calendar: " + joinCal.name + thisUser.code + 'JoinCalendar');

            let days = thisUser.days.length;
            let hours = thisUser.hours;
            console.log("days: " + days + " hours: " + hours);
            for (let day = 0; day < days; day++) {
                for (let hour = 0; hour < hours; hour++) {
                    let index = (day*hours + hour);
                    console.log("index: " + index);
                    if (thisUser.calendar[index].available === false) {
                        console.log('not available! updating - day: ' + (day+1) + " hour: "+ (hour+1));
                        console.log("availability: " + joinCal.calendar[index].available);
                        joinCal.calendar[index].available = false;
                        joinCal.save(function(err){});
                    }
                }
            }
        }
    });
};
// create a model using it
let User = mongoose.model('User', userSchema);
module.exports = User; //make available to users in Node application