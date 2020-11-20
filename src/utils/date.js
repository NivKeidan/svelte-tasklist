import { userMessages } from '../stores.js';
import {NO_DATE} from './constants';

const inXDaysRegex = "in ([1-9]+) day[s]?";
const inXWeeksRegex = "in ([1-9]+) week[s]?";
const inXMontsRegex = "in ([1-9]+) month[s]?";
const inXYearsRegex = "in ([1-9]+) year[s]?";
const relativeDaysRegex = "today|tdy|tmrw|tomorrow";
const weekDaysRegex = "sunday|monday|tuesday|wednesday|thursday|friday|saturday";
const generalRegex = "general";
const numericDayMonthRegex = "(0?[1-9]|[1-2][0-9]|3[0-1])[./](1[0-2]|0?[1-9])";
const numeric2DigitYearRegex = "[2-9][0-9]";
const numeric4DigitYearRegex = "202[0-9]|2[1-9][0-9]{2}";
const numericDateRegex = numericDayMonthRegex + "([./]("+numeric2DigitYearRegex+"|"+numeric4DigitYearRegex+"))?";


const dateRegexes = [
    inXDaysRegex+"|"+inXWeeksRegex+"|"+inXMontsRegex+"|"+inXYearsRegex,
    relativeDaysRegex,
    numericDateRegex,
    weekDaysRegex,
    generalRegex,
];
export const DATE_REGEX = RegExp("\\b"+combineRegexes(dateRegexes)+"\\b", "gi");

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
        case 'general':
            return NO_DATE;
    }

    let regex = RegExp("^"+inXDaysRegex+"$", "i");
    let res = dateString.match(regex);
    if (res !== null) {
        return getDaysFromToday(parseInt(res[1]));
    }

    regex = RegExp("^"+inXWeeksRegex+"$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        return getWeeksFromToday(parseInt(res[1]));
    }

    regex = RegExp("^"+inXMontsRegex+"$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        return getMonthsFromToday(parseInt(res[1]));
    }

    regex = RegExp("^"+inXYearsRegex+"$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        return getYearsFromToday(parseInt(res[1]));
    }

    let day = 0;
    let month = 0;
    let year = 0;
    regex = RegExp("^"+numericDayMonthRegex, "i");
    res = dateString.match(regex);
    if (res !== null) {
        
        day = parseInt(res[1]);
        if (day < 1 || day > 31)
            userMessages.addError("Invalid day: " + res[1]);
        
            month = parseInt(res[2]);
        if (month < 1 || month > 12) 
            userMessages.addError("Invalid month: " + res[2]);
    }
    regex = RegExp("("+numeric2DigitYearRegex+"|"+numeric4DigitYearRegex+")$", "i");
    res = dateString.match(regex);
    if (res !== null) {
        let year = parseInt(res[1]);
        if (year < 100 && year + 2000 < 2020)  // 2 digits
            userMessages.addError("Invalid year: " + res[3]);
        if (year > 999 && year < 2020)
            userMessages.addError("Invalid year: " + res[3]);
        
    }
    if (day !== 0 && month !== 0) {
        if (year !== 0)
            return dateByDayMonthYear(day, month, year);
        else
            return dateByDayMonth(day, month);
    }

    return "";
}

export function validateFullDateString(dateStr) {
    const yearPart = parseInt(dateStr.substring(0, 4));
    const monthPart = parseInt(dateStr.substring(4, 6));
    const dayPart = parseInt(dateStr.substring(6));

    if (yearPart < 2020 || yearPart > 2999) {
        userMessages.addError("Date Input Error: Year not valid")
        return false;
    }

    if (monthPart === 0 || monthPart > 12) {
        userMessages.addError("Date Input Error: Month not valid");
        return false;
    }

    if (dayPart === 0 || dayPart > 31) {
        userMessages.addError("Date Input Error: Day not valid");
        return false;
    }

    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (yearPart % 400 === 0 || (yearPart % 100 !== 0 && yearPart % 4 === 0))
        daysPerMonth[1] = 29;

    if (dayPart > daysPerMonth[monthPart - 1]) {
        userMessages.addError("Date Input Error: This month has only " + daysPerMonth[monthPart - 1] + " days");
        return false;
    }
    return true;
}

export function getDayName(dateString) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = stringToDate(dateString);
    return days[d.getDay()];
}

export function getDisplayDate(dateString) {
    let dateParts = breakApart(dateString);
    const currentYear =  new Date().getFullYear();
    let finalString =  dateParts.day + "." + dateParts.month;
    if (parseInt(dateParts.year) !== currentYear) {
        finalString = finalString + "." + dateParts.year.substring(2);
    }
    return finalString;
}

function breakApart(dateString) {
    let returnObj = {};
    returnObj.year = dateString.substring(0, 4);
    returnObj.month = dateString.substring(4,6);
    returnObj.day = dateString.substring(6);

    return returnObj;
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
    d.setDate(dateParts.day);
    d.setMonth(dateParts.month-1);
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