const dateRegexes = [
    "in [0-9]+ day[s]?|in [0-9]+ week[s]?|in [0-9]+ month[s]?|in [0-9]+ year[s]?",
    "today|tdy|tmrw|tomorrow",
    "[1-9][0-9]?[./][1-9][0-2]?([./](2[0-9]{3}|[2-9][0-9]))?",
    "sunday|monday|tuesday|wednesday|thursday|friday|saturday",
]

const AutoSetChar = "A";
export const AutoTimeMin = AutoSetChar+"0000";
export const AutoTimeMax = AutoSetChar+"9999";
export const AutoTimeDefault = AutoSetChar+"5000";
export const DATE_REGEX = RegExp("\\b"+combineRegexes(dateRegexes)+"\\b", "gi");
export const TIME_REGEX = RegExp("\\b[012][0-9][0-5][0-9]\\b", "g");

export function getDaysFromToday(n) {
    let d = new Date();
    d.setDate(d.getDate() + n);
    return dateToString(d);
}

export function analyzeDateString(dateString) {
    if (dateString === null || dateString === undefined)
        return getDaysFromToday(0);

    switch (dateString.toLowerCase()) {
        case 'today':
        case 'tdy':
            return getDaysFromToday(0);
        case 'tmrw':
        case 'tomorrow':
            return getDaysFromToday(1);
        case 'sunday':
            return getDateByNextWeekday(0);
        case 'monday':
            return getDateByNextWeekday(1);
        case 'tuesday':
            return getDateByNextWeekday(2);
        case 'wednesday':
            return getDateByNextWeekday(3);
        case 'thursday':
            return getDateByNextWeekday(4);
        case 'friday':
            return getDateByNextWeekday(5);
        case 'saturday':
            return getDateByNextWeekday(6);
    }

    let regex = RegExp("^in ([0-9]+) (day[s]?|month[s]?|week[s]?|year[s]?)$", "i");
    let res = dateString.match(regex);
    if (res !== null) {
        let timeSpan = res[2].toLowerCase();
        if (timeSpan.indexOf("day") !== -1)
            return getDaysFromToday(parseInt(res[1]));
        else if (timeSpan.indexOf("month") !== -1)
            return getMonthsFromToday(parseInt(res[1]));
        else if (timeSpan.indexOf("year") !== -1)
            return getYearsFromToday(parseInt(res[1]));
        else if (timeSpan.indexOf("week") !== -1)
            return getWeeksFromToday(parseInt(res[1]));
    }

    regex = RegExp("^([1-9][0-9]?)[./]([1-9][0-2]?)$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        let day = parseInt(res[1]);
        let month = parseInt(res[2]);
        if (day < 1 || day > 31)
            console.log("invalid day: " + res[1]);
        else if (month < 1 || month > 12)
            console.log("invalid month: " + res[2]);
        else
            return dateByDayMonth(day, month);
    }

    regex = RegExp("^([1-9][0-9]?)[./]([1-9][0-2]?)[./](2[0-9]{3}|[2-9][0-9])$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        let day = parseInt(res[1]);
        let month = parseInt(res[2]);
        let year = parseInt(res[3]);
        console.log(year);
        if (day < 1 || day > 31)
            console.log("invalid day: " + res[1]);
        else if (month < 1 || month > 12)
            console.log("invalid month: " + res[2]);
        else if (year < 100 && year + 2000 < 2020)  // 2 digits
            console.log("invalid year: " + res[3]);
        else if (year > 999 && year < 2020)
            console.log("invalid year: " + res[3]);
        else
            return dateByDayMonthYear(day, month, year);
    }

    return "";
}

export function analyzeTimeString(timeString) {
    if (timeString !== "")
        return timeString;
    return AutoTimeDefault;
}

export function getLastUpcomingDateString() {
    let d = new Date();
    d.setDate(d.getDate() + 7);
    return dateToString(d);
}

export function getDayName(dateString) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = stringToDate(dateString);
    return days[d.getDay()];
}

export function breakApart(dateString) {
    let returnObj = {};
    returnObj.year = dateString.substring(0, 4);
    returnObj.month = dateString.substring(4,6);
    returnObj.day = dateString.substring(6);

    return returnObj;
}

export function getDisplayString(d) {
    if (isAutoSetTime(d))
        return d.slice(1,3) + ":" + d.slice(3);
    return d.slice(0,2) + ":" + d.slice(2);
}

export function convertToAuto(t) {
    if (isAutoSetTime(t))
        return t;
    else
        return AutoSetChar+t;
}

export function getNewTime(prevTime, postTime=AutoTimeMax) {
    let prevTimeValue = getTimeValue(prevTime);
    const difference = parseInt(getTimeValue(postTime)) - parseInt(prevTimeValue);
    const expectedIntValue = parseInt(prevTimeValue) + Math.floor(difference / 2);
    if (expectedIntValue > AutoTimeMax)
        return AutoTimeMax;
    if (expectedIntValue < AutoTimeMin)
        return AutoTimeMin;
    return AutoSetChar + expectedIntValue.toString();
}

function getYearsFromToday(n) {
    let d = new Date();
    d.setFullYear(d.getFullYear() + n);
    return dateToString(d);
}

function getMonthsFromToday(n) {
    let d = new Date();
    d.setMonth(d.getMonth() + n);
    return dateToString(d);
}

function getWeeksFromToday(n) {
    let d = new Date();
    d.setDate(d.getDate() + (n*7));
    return dateToString(d);
}

function combineRegexes(regexArr) {
    let t = "";
    for (let i = 0; i < regexArr.length; i++) {
        t = t + regexArr[i] + "|"
    }
    t = t.substring(0, t.length - 1); // Remove last |
    return t;
}

function dateToString(d) {
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const day = d.getDate();
    return ""+year+(month < 10 ? "0"+month : month)+(day < 10 ? "0"+day : day);
}

function stringToDate(dateString) {
    const dateParts = breakApart(dateString);

    let d = new Date();
    d.setFullYear(dateParts.year);
    d.setMonth(dateParts.month-1);
    d.setDate(dateParts.day);
    return d;
}

function getDateByNextWeekday(dayNum) {
    let d = new Date();
    d.setDate(d.getDate() + (dayNum - 1 - d.getDay() + 7) % 7 + 1);
    return dateToString(d);
}

function dateByDayMonth(day, month) {
    let d = new Date();
    d.setMonth(month-1);
    d.setDate(day);
    const today = new Date();
    if (d < today)
        d.setFullYear(today.getFullYear() + 1);
    return dateToString(d);
}

function dateByDayMonthYear(day, month, year) {
    let d = new Date();
    let fullYear;
    d.setMonth(month-1);
    d.setDate(day);
    const today = new Date();
    if (d < today)
        d.setFullYear(today.getFullYear() + 1);
    year < 100 ? fullYear = 2000 + year : fullYear = year;
    d.setFullYear(fullYear);
    return dateToString(d);
}

export function isAutoSetTime(t) {
    return t[0] === AutoSetChar;
}

export function timeCompareFn(a, b) {
    return getTimeValue(a) - getTimeValue(b);
}

function getTimeValue(t) {
    if (isAutoSetTime(t))
        return t.substring(1);
    return t;
}