var myCallback = function(data) {
    console.log('got data: '+data);
};

var usingItNow = function(callback) {
    callback('get it?');
};

usingItNow(myCallback);
