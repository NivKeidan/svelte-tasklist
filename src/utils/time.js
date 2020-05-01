import { SECTIONS } from '../constants';

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