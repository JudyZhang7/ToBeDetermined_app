// visually clear all hours on day cal and reset timesAvailableDay set to FALSE
function ClearAll(){
    console.log("CLEARING ALL!");
    let x = document.getElementById("hoursInADay");
    let y = x.getElementsByTagName("td");
    for (let i = 0; i < y.length; i++) {
        y[i].classList.remove("highlighted");
        timesAvailableDay[i] = false;
    }
}

// visually load the already created day cal
function setAll(){
    console.log("[...in setAll function...]");
    let x = document.getElementById("hoursInADay");
    let y = x.getElementsByTagName("td");
    for (let i = 0; i < y.length; i++) {
        if(timesAvailableDay[i] === true){
            y[i].classList.add("highlighted");
        }
        else{
            y[i].classList.remove("highlighted");
        }
    }
}

function updateCalHighlight(nextDay){
    //[ *** change the previously highlighted day back to grey *** ]
    let today = cal[currentDayIndex];
    let table = $("#calendar")[0];
    let week = today/7;
    let day = today%7;
    let cell = table.rows[parseInt(week)].cells[day - 1];
    let color = '#CBCBCB';
    $(cell).css('background-color', color); //highlight selected cells

    //[ *** update the next day's color *** ]
    if(nextDay){
        currentDayIndex++;
    } else{
        currentDayIndex--;
    }
    today = cal[currentDayIndex];
    week = today/7;
    day = today%7;
    cell = table.rows[parseInt(week)].cells[day - 1];

    color = '#FFC99B';
    $(cell).css('background-color', color);
}

// save current day cal to timesAvailableTotal
function saveHours(){
    if(currentDayIndex >= timesAvailableTotal.length) { // new timesAvailableDay, push to timesAvailableTotal
        console.log("pushing... " + timesAvailableDay + " to index: " + timesAvailableTotal.length);
        let arrayCopy = timesAvailableDay.slice();
        timesAvailableTotal.push(arrayCopy);
    } else{ //overwrite the old calendar
        timesAvailableTotal[currentDayIndex] = timesAvailableDay;
    }
}

function updateCal(isNextDay){
    //[ *** save the previous calendar before moving to new one *** ]
    saveHours();
    //[ *** update the coloring on calendar. *NOTE: updateCalHighlight also increments/decrements on day *** ]
    updateCalHighlight(isNextDay);

    //[ *** set up the hours cal to work on *** ]
    if(currentDayIndex >= timesAvailableTotal.length){ // work on new blank day
        console.log("currentDayIndex: " + currentDayIndex + " timesAvailableTotal: " + timesAvailableTotal.length);
        ClearAll();
    }
    else { // load and update already created day
        console.log("currentDayIndex: " + currentDayIndex + " timesAvailableTotal: " + timesAvailableTotal.length);
        timesAvailableDay = timesAvailableTotal[currentDayIndex];
        console.log(timesAvailableDay);
        console.log(timesAvailableTotal);
        setAll();
    }
}

function arrow(isNextButton){
    console.log("[...in arrow function...]");
    //make sure at least one time is selected
    if(!timesAvailableDay.includes(true)){
        alert('Please select at least one time.');
        return;
    }
    // check legality of move (forward or backwards)
    if(isNextButton){
        //end of calendar, cannot access more
        if((currentDayIndex + 1) >= cal.length) {
            alert("error, end of calendar " + (currentDayIndex + 1) + " is over the limit of " + cal.length);
            return;
        }
    } else{
        if((currentDayIndex - 1) < 0){
            alert("error, end of calendar " + (currentDayIndex - 1) + " is under the limit of 0");
            return;
        }
    }
    // must be legal to move in calendar, let's continue
    updateCal(isNextButton);
    document.getElementById("currentDay").innerHTML = cal[currentDayIndex];
}

function addNewUser(name, event, caldays, timesAvailableTotal) {
    console.log("[ in addNewUser function ]");
    var userData = {
        code: null,
        calendarName: event,
        name: name,
        days: caldays,
        newCalendar: true,
        calendar: timesAvailableTotal
    };
    console.log(userData);
    socket.emit('saveUser', JSON.stringify(userData));
}
function finished(){
    console.log("[...finished picking times... saving to database]");
    saveHours();
    if(!timesAvailableDay.includes(true)){
        alert('Please select at least one time.');
        return;
    }
    if(timesAvailableTotal.length!=cal.length){
        alert("Please select at least one time for every day");
        return;
    }
    window.sessionStorage.setItem("userDays", JSON.stringify(timesAvailableTotal));
    var userDays = JSON.parse(sessionStorage.getItem("userDays")); // An object :D
    console.log("user hours available length: " + userDays.length);

    // save to mongoDB...?
    addNewUser(name, event, cal, timesAvailableTotal);
}