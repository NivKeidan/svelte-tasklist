import { SECTIONS } from '../constants';

export const DATE_REGEX = RegExp("\\b(today|tdy|tmrw|tomorrow|in [0-9]+ day[s]?)\\b", "gi");
export const TIME_REGEX = RegExp("\\b[012][0-9][0-5][0-9]\\b", "g");

export function getDaysFromToday(n) {
    let d = new Date();
    d.setDate(d.getDate() + n);
    return dateToString(d);
}

export function analyzeDateString(dateString) {
    if (dateString === null || dateString === undefined)
        return getDefaultDate();

    switch (dateString) {
        case 'today':
        case 'tdy':
            return getDaysFromToday(0);
        case 'tmrw':
        case 'tomorrow':
            return getDaysFromToday(1);
    }

    const regex = RegExp("^in ([0-9]+) day[s]?$", "i");
    let res = dateString.match(regex);
    if (res !== null)
        return getDaysFromToday(parseInt(res[1]));

}

export function analyzeTimeString(timeString) {
    if (timeString !== "")
        return timeString;
    return getDefaultTime;
}

function dateToString(d) {
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const day = d.getDate();
    return year+(month < 10 ? "0"+month : month)+(day < 10 ? "0"+day : day);
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

function stringToDate(dateString) {
    const dateParts = breakApart(dateString);

    let d = new Date();
    d.setFullYear(dateParts.year);
    d.setMonth(dateParts.month-1);
    d.setDate(dateParts.day);
    return d;
}