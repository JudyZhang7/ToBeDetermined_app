let socket = io.connect('http://localhost:3000');
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
$(document).ready(function() {
    let code = window.sessionStorage.getItem("userCode");
    //let code = 'aO3HY';
    let now = new Date(); // (2018, 8, 1, 1, 1, 1, 1) custom date
    let cal, hours, event, name, timesAvailableTemplate, days, host;

    socket.emit('getUserCal', code); // get code from calendar database
    socket.emit('getContributers', code);
    socket.on('userCal', function (result) {
        cal = result.days;
        hours = result.hours;
        event = result.calendarName;
        name = result.name;
        days = result.days;
        host = result.hostname;
        console.log("days: " + days);
        timesAvailableTemplate = result.calendar.slice(); // make a hard copy of calendar array

        let innerHTMLText = '';
        for (let i = 0; i < days.length; i++) {
            innerHTMLText += '<div id = "dayTable">';
            innerHTMLText += '<div id = "date">' + monthNames[now.getMonth()] + " " + days[i] + '</div>';
            innerHTMLText += '<table cellpadding="0" cellspacing="0" id="' + i + '" class = "">\n' +
                '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
                '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
                '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
                '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
                '</table>';
            innerHTMLText += '</div>';
        }
        $('#calDays').html(innerHTMLText);
        $('#calName').html(event + " <div id = \"host\" style = \"font-weight: 100; display: inline-block; font-size: 40px;\">by: " + host + "</div>");
        $('#calCode').html("code: " + code);
        for (let j = 0; j < days.length; j++) {
            let hourIndex = hours * j;
            let timeIndex = 0;
            let timetable = document.getElementById(j);
            let date = 8;

            let r = 0;
            while (row = timetable.rows[r++]) {
                let c = 0;
                while (cell = row.cells[c++]) {
                    if (date > 12) {
                        cell.innerHTML = (date - 12) + ":00 PM"; // do sth with cell
                    }
                    else {
                        cell.innerHTML = date + ":00 AM"; // do sth with cell
                    }
                    if (timesAvailableTemplate[hourIndex + timeIndex].available === true) {
                        cell.classList.add("highlighted");
                    }
                    date++;
                    timeIndex++;
                }
            }
        }

    });
    socket.on('contributers', function (result) {
        let contributerString = 'contributers: ';
        for (let k = 0; k < result.length; k++) {
            let contri = result[k].name;
            if (k !== (result.length - 1)) {
                contributerString += contri + ", ";
            }
            else {
                contributerString += contri;
            }
        }
        $('#contributers').html(contributerString);
    });
    $("body").css("display", "block");
});