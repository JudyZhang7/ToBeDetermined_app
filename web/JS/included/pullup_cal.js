function pullupCal(result){
    console.log("days: " + cal);
    timesAvailableTemplate = result.calendar.slice(); // make a hard copy of calendar array

    let innerHTMLText = '';
    for (let i = 0; i < cal.length; i++) {
        innerHTMLText += '<div id = "dayTable">';
        innerHTMLText += '<div id = "date"> July ' + cal[i] + '</div><br>';
        innerHTMLText += '<table cellpadding="0" cellspacing="0" id="' + i + '" class = "summaryTable">\n' +
            '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
            '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
            '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
            '    <tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>\n' +
            '</table>'
        innerHTMLText += '</div>';
    }
    $('#calDays').html(innerHTMLText);
    $('#calName').html(event);
    $('#calCode').html("code: " + code);
    for (let j = 0; j < cal.length; j++) {
        let hourIndex = hours * j;
        let timeIndex = 0;
        var timetable = document.getElementById(j);
        var date = 8;

        var r = 0;
        while (row = timetable.rows[r++]) {
            var c = 0;
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
}; // TODO: update the pullup calendar