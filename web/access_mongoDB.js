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
mongoose.connect('mongodb://localhost/calDatabase'); //connect to mongoDB database
var Schema = mongoose.Schema;

var userSchema = new Schema({
    code: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    calendarName: {type: String},
    calendar: {type: Array, required: true}
});

//define cool methods like formatting, hashing passwords etc.
userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

userSchema.methods.dudify = function(){
    this.name = this.name + '-dude';
    return this.name;
}

userSchema.methods.createCal = function() {
    var cal = new User({
        code: this.code,
        name: 'MainCalendar',
        calendarName: this.calendarName,
        calendar: this.calendar
    });
    cal.save(function(err){
        if(err) throw err;
        console.log('mainCalendar saved successfully');
    });
}

userSchema.methods.updateCal = function() {
    //find calendar with the correct code
}

//create a model using it
var User = mongoose.model('User', userSchema);
module.exports = User; //make available to users in Node application
console.log("defined userSchema!");