import { SECTIONS } from '../constants';

export const DATE_REGEX = RegExp("\\b(today|tdy|tmrw|tomorrow|in [0-9]+ day[s]?)\\b", "gi");
export const TIME_REGEX = RegExp("\\b[012][0-9][0-5][0-9]\\b", "g");

export function getDefaultDate() {
    return getTodayDateString();
}

export function getDefaultTime() {
    return "0123";
}

export function getSection(dateString) {
    if (dateString <= getTodayDateString())
        return SECTIONS.DAILY;
    if (dateString <= getLastUpcomingDateString())
        return SECTIONS.UPCOMING;
    return SECTIONS.FUTURE;
}

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

function getTodayDateString() {
    const today = new Date();
    return dateToString(today);
}

function dateToString(d) {
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const day = d.getDate();
    return year+(month < 10 ? "0"+month : month)+(day < 10 ? "0"+day : day);
}

function getLastUpcomingDateString() {
    let d = new Date();
    d.setDate(d.getDate() + 7);
    return dateToString(d);
}

