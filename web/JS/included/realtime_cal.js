const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let DayArray=[];
let buffer = 0;
let bufferDone = false;
(function today() {
    let now = new Date(); // (2018, 8, 1, 1, 1, 1, 1) custom date
    let month = now.getMonth();
    let year = now.getFullYear();
    calendarDisplay(month, year);
}());
function calendarDisplay(month, year) {
    let days = getMonthDays(month + 1, year);
    let firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay();
    setThePrintLoop(startDay,days)
}
function setThePrintLoop(s){
    for(i=0;i<42;i++){
        if(i>=(s) && (i-s)<31){
            DayArray.push((i-s+1))
            bufferDone = true;
        }
        else{
            DayArray.push('')
            if(!bufferDone){
                buffer ++;
            }
        }
    }
}
function getMonthDays(month, year) {
    let days;
    if (month === 1 || month === 3 || month === 5 || month === 7
        || month === 8 || month === 10 || month === 12)
        days = 31;
    else if (month === 4 || month === 6 || month === 9
        || month === 11)
        days = 30;
    else if (month === 2) {
        if (isLeapYear(year)) {
            days = 29;
        }
        else {
            days = 28;
        }
    }
    return (days);
}
function isLeapYear(year) {
    if (year % 4 === 0) // basic rule
        return true; // is leap year
    return false // is not leap year
}
function sortNumber(a,b) {
    return a - b;
}
