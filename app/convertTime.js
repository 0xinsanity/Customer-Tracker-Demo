var convertToFullTime = function(someTime) {
    if(someTime != null) {
        const index = someTime.indexOf(":");
        if (index == 1) {
            // 1 Digit

            const hour_part = parseInt(someTime.substring(0,1));
            const min_part = parseInt(someTime.substring(2,4));

            if (hour_part === 0) {
                hour_part = 12;
            }

            if (min_part == 0) {
                return someTime + "-" + hour_part+ ':29 '+someTime.substring(someTime.length-2);
            } else {
                return someTime + "-" + hour_part+ ':59 '+someTime.substring(someTime.length-2);
            }
        } else {
            // 2 Digits

            const hour_part = parseInt(someTime.substring(0,2));
            const min_part = parseInt(someTime.substring(3,5));

            if (hour_part > 12) {
                if (min_part == 0) {
                    return (hour_part-12)+ ":00-" + (hour_part-12)+ ':29 '+someTime.substring(someTime.length-2);
                } else {
                    return (hour_part-12)+ ":30-" + (hour_part-12)+ ':59 '+someTime.substring(someTime.length-2);
                }
            } else if (hour_part == 12) {
                if (min_part == 0) {
                    return someTime + "-" + hour_part+ ':29 '+someTime.substring(someTime.length-2);
                } else {
                    return someTime + "-" + hour_part+ ':59 '+someTime.substring(someTime.length-2);
                }
            } else {
                if (min_part == 0) {
                    return someTime + "-" + hour_part+ ':29 '+someTime.substring(someTime.length-2);
                } else {
                    return someTime + "-" + hour_part+ ':59 '+someTime.substring(someTime.length-2);
                }
            }

        }
        }
        return '';
};

var convertToMilitaryTime = function(time) {
    var ampm = time.substring(time.length - 2);
    var hours = parseInt(time.substring(0, time.length - 2));
    var new_time = time.substring(0,time.length-3);
    if ((ampm === 'PM' && hours !== 12) || (ampm === 'AM' && hours === 12)) {
        hours += 12;
        return `${hours}:${new_time.substring(new_time.length-2)}`;
    }
    return time.substring(0, time.length - 3);
};

var convertToRegularTime = function (time) {
    var hours = parseInt(time.substring(0, time.length - 3));

    if (hours === 24) {
        hours -= 12;
        return hours+":"+time.substring(3)+ " AM";
    } else if (hours > 12) {
        hours -= 12;
        return hours+":"+time.substring(3)+ " PM";
    } else if (hours === 12) {
        return hours+":"+time.substring(3)+ " PM";
    } else {
        return time+ " AM";
    }
}

var convertToDate = function(date_str) {
    if (date_str === undefined) 
        return;

    const colon1 = date_str.indexOf('/');
    const colon2 = date_str.indexOf('/', colon1+1);
    const date1_str = `${2000+parseInt(date_str.substring(date_str.length-2))}/${date_str.substring(0,colon1)}/${date_str.substring(colon1+1, colon2)}`;
        
    return new Date(date1_str);

}

module.exports = {
    convertToFullTime,
    convertToMilitaryTime,
    convertToRegularTime,
    convertToDate
};