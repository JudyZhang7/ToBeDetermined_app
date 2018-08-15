let event, name;
let boxesInCalendar = 49;
let hoursInADay = 16; // allow user to pick from 16 hours
const current = new Date();
let currentMonth = current.getMonth()
let currentYear = current.getFullYear()

let socket = io.connect('http://www.tbd.red:'+process.env.PORT);
const weekNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// visually clear all hours on day cal and reset timesAvailableDay set to FALSE
function clearAll() {
    console.log("[Clearing all from day cal...]");
    let x = document.getElementById("hoursInADay");
    let y = x.getElementsByTagName("td");
    for (let i = 0; i < y.length; i++) {
        y[i].classList.remove("highlighted");
        timesAvailableDay[i] = false;
    }
}

// load the next day hours calendar
function setHoursCal() {
    document.getElementById("currentDayAndMonth").innerHTML = weekNames[new Date(currentYear, currentMonth, cal[currentDayIndex]).getDay()] + " " + cal[currentDayIndex];
    timesAvailableDay = timesAvailableTotal[currentDayIndex]; // update to next day calendar
    let x = document.getElementById("hoursInADay");
    let y = x.getElementsByTagName("td");
    for (let i = 0; i < y.length; i++) {
        y[i].classList.remove("highlighted");
        if (timesAvailableDay[i] === true) { // this is new calendar
            y[i].classList.add("highlighted");
        }
    }
    console.log("[Setting calendar to this previously created day... ]" + timesAvailableDay);
}

// increments the current day index
function updateCalHighlight(nextDay, setHours_cb) {
    // change the previously highlighted day back to grey
    let today = parseInt(cal[currentDayIndex]) + buffer;
    let table = $("#calendar")[0];
    let week, day;
    if (today % 7 === 0) {
        week = today / 7 - 1;
        day = 6;
    } else {
        week = today / 7;
        day = today % 7 - 1;
    }
    let cell = table.rows[parseInt(week)].cells[day];
    let color = '#CBCBCB';
    $(cell).css('background-color', color); //highlight selected cells
    // update the next day's color
    if (nextDay) {
        currentDayIndex++;
    } else {
        currentDayIndex--;
    }
    today = cal[currentDayIndex] + buffer;
    if (today % 7 === 0) {
        week = today / 7 - 1;
        day = 6;
    } else {
        week = today / 7;
        day = today % 7 - 1;
    }
    cell = table.rows[parseInt(week)].cells[day];
    color = '#FFC99B';
    $(cell).css('background-color', color);
    setHours_cb(); // callback to set the hours
}

// update all calendars
function updateCal(isNextDay) {
    // save the previous calendar before moving to new one
    saveHours();
    // update the coloring on calendar.
    // !!!NOTE: updateCalHighlight also increments/decrements on day
    updateCalHighlight(isNextDay, function () {
        // set up the hours cal to work on
        setHoursCal();
    });
}

// function to handle when user uses the arrow
function arrow(isNextButton) {
    console.log("[...in arrow function...]");
    // make sure at least one time is selected
    // TODO: is checking if at least one time ...this necessary? No I don't think so.
    // if(!timesAvailableDay.includes(true)){
    //     alert('Please select at least one time.');
    //     return;
    // }
    // check legality of move (forward or backwards)
    if (isNextButton) {
        //end of calendar, cannot access more
        if ((currentDayIndex + 1) >= cal.length) {
            alert("Error: You are at the end of your calendar.");
            return;
        }
    } else { // going to previous day
        if ((currentDayIndex - 1) < 0) {
            alert("Error: You are at the beginning of your calendar.");
            return;
        }
    }
    // must be legal to move in calendar, let's continue
    updateCal(isNextButton);
}

// save hours in timesAvailableTotal array
function saveHours() {
    timesAvailableTotal[currentDayIndex] = timesAvailableDay;
}

function addNewUser(name, event, caldays, timesAvailableTotal) {
    let userData = {
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

function finished() {
    console.log("[...finished picking times... saving to database]");
    saveHours();
    // if(!timesAvailableDay.includes(true)){
    //     alert('Please select at least one time.');
    //     return;
    // }
    // if(timesAvailableTotal.length!=cal.length){
    //     alert("Please look at each day.");
    //     return;
    // }
    window.sessionStorage.setItem("userDays", JSON.stringify(timesAvailableTotal));
    let userDays = JSON.parse(sessionStorage.getItem("userDays")); // An object :D
    console.log("user hours available length: " + userDays.length);
    // save to mongoDB...?
    console.log(name + event);
    addNewUser(name, event, cal, timesAvailableTotal);
}

function callback(isNewCal) {
    $(document).ready(function () {
        // !!!load the right panel month calendar
        $("#rightPanel").load("shared/right_panel_cal.html", function () {
            //once loaded,
            console.log("setting date");
            let table = $("#calendar")[0];

            event = window.sessionStorage.getItem("event"); // An object :D, 1D array of days
            name = window.sessionStorage.getItem("name");
            document.getElementById("event").innerHTML = event;
            document.getElementById("name").innerHTML += name;
            //set the dates
            let date = 0;
            let r = 0; //row
            let first = true;
            while (row = table.rows[r++]) {
                let c = 0; //column
                while (cell = row.cells[c++]) {
                    let greyedOut = '#CBCBCB';
                    if (DayArray[date] === "") {
                        //$(cell).css('background-color', greyedOut)
                        cell.classList.add("dbluestripes");
                    }
                    cell.innerHTML = DayArray[date]; // do sth with cell
                    let color = '#CBCBCB';
                    if (cal.includes(DayArray[date])) {
                        if (first) {
                            color = '#FFC99B';
                            first = false;
                        }
                        console.log("Cell: " + cell.innerHTML);
                        // let cell = table.rows[r-1].cells[c-1];
                        //highlight selected cells
                        $(cell).css('background-color', color);
                    }
                    date++;
                }
            }
            $("body").css("display", "block");

            $("#rightPanel").slideDown("");
        });
        $("#selectHours").load("shared/select_hours.html", function () {
            document.getElementById("instructions").addEventListener("click", function () {
                var content = this;
                if (content.style.maxHeight === "40vh") {
                    console.log("setting height to null");
                    content.style.maxHeight = 0;
                } else {
                    content.style.maxHeight = "40vh";
                }
            });
            document.getElementById("instructions").click();
            //set the dates
            if (!isNewCal) {
                document.getElementById("instructions").innerHTML +=
                    "    <span style= \"font-weight: 400\"> > </span> to view all the times for this event, click on '<span style= \"font-weight: 400\">show all times</span>'<br>\n" +
                    "<span style= \"font-weight: 400\"> > </span> <div id = \"sampleBox\" class = \"unavailable\"></div> indicates there is at least one person who is unavailable at that time ";
            }
            document.getElementById("currentDayAndMonth").innerHTML = weekNames[new Date(currentYear, currentMonth, cal[currentDayIndex]).getDay()] + " " + cal[currentDayIndex];
            let timetable = document.getElementById("hoursInADay");
            let date = 8;

            let r = 0;
            if (isNewCal) {
                while (row = timetable.rows[r++]) {
                    let c = 0;
                    while (cell = row.cells[c++]) {
                        if (date > 12) {
                            cell.innerHTML = (date - 12) + ":00 PM"; // do sth with cell
                        }
                        else {
                            cell.innerHTML = date + ":00 AM"; // do sth with cell
                        }
                        date++;
                    }
                }
            }
            else { // TODO: for an already created calendar show other calendar inputs
                let hourIndex = hours * currentDayIndex;
                // let timeIndex = hourIndex;
                let timeIndex = 0;
                while (row = timetable.rows[r++]) {
                    let c = 0;
                    while (cell = row.cells[c++]) {
                        if (date > 12) {
                            cell.innerHTML = (date - 12) + ":00 PM"; // do sth with cell
                        }
                        else {
                            cell.innerHTML = date + ":00 AM"; // do sth with cell
                        }
                        // grey out if day is not available to be selected
                        // console.log("index of cal: " + (hourIndex + timeIndex));
                        if (timesAvailableTemplate[hourIndex + timeIndex].available === false) {
                            cell.classList.add("unavailable");
                        }
                        date++;
                        timeIndex++;
                    }
                }
            }
            // !!! highlighting the hours the user picks/mouses over
            $(function () {
                let isMouseDown = false,
                    isHighlighted;

                $("#hoursInADay td").mousedown(function () {
                    let selectedIndex = ($("td").index(this) - boxesInCalendar);
                    console.log("index of selected: " + selectedIndex);
                    isMouseDown = true;
                    $(this).toggleClass("highlighted");
                    //if in array, remove. if not, add.
                    if (timesAvailableDay[selectedIndex] === true) {
                        timesAvailableDay[selectedIndex] = false;
                    } else {
                        timesAvailableDay[selectedIndex] = true;
                    }
                    // TESTING
                    let daysAvailable = 0;
                    for (let p = 0; p < timesAvailableDay.length; p++) {
                        if (timesAvailableDay[p] === true) {
                            daysAvailable++;
                        }
                    }
                    console.log("the day is: " + this.innerHTML + " calendar length: " + daysAvailable);

                    isHighlighted = $(this).hasClass("highlighted");
                    return false; // prevent text selection
                })
                    .mouseover(function () {
                        if (isMouseDown) {
                            let selectedIndex = ($("td").index(this) - boxesInCalendar);
                            $(this).toggleClass("highlighted", isHighlighted);
                            if (timesAvailableDay[selectedIndex] === true) {
                                timesAvailableDay[selectedIndex] = false;
                            } else {
                                timesAvailableDay[selectedIndex] = true;
                            }
                        }
                    })
                    .bind("selectstart", function () {
                        return false;
                    })

                $(document).mouseup(function () {
                    isMouseDown = false;
                });
            });

            // !!!fade the tip
            setTimeout(function () {
                $("#tip").fadeOut(1900);
            }, 7000);
            setTimeout(function () {
                $("#instructions").css("maxHeight", "0");
            }, 14000);
        })
    });
}

document.addEventListener("keyup", event => {
    if (event.defaultPrevented) return
    switch (event.key) {
        case "ArrowLeft":
            $("#prevButton").css("color", "var(--highlightedColor)");
            setTimeout(function () {
                $("#prevButton").css("color", "var(--darkGreyColor)")
            }, 200);
            arrow(false);
            break;
        case "ArrowRight":
            $("#nextButton").css("color", "var(--highlightedColor)");
            setTimeout(function () {
                $("#nextButton").css("color", "var(--darkGreyColor)")
            }, 200);
            arrow(true);
            break;
    }
})