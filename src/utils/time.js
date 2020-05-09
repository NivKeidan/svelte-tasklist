const AutoSetChar = "A";
export const AutoTimeMin = AutoSetChar + "0000";
export const AutoTimeMax = AutoSetChar + "9999";
export const AutoTimeDefault = AutoSetChar + "5000";
export const TIME_REGEX = RegExp("\\b[012][0-9][0-5][0-9]\\b", "g");

export function analyzeTimeString(timeString) {
    if (timeString !== "")
        return timeString;
    return AutoTimeDefault;
}

export function convertToAuto(t) {
    if (isAutoSetTime(t))
        return t;
    else
        return AutoSetChar+t;
}

export function isAutoSetTime(t) {
    return t[0] === AutoSetChar;
}

export function timeCompareFn(a, b) {
    return getTimeValue(a) - getTimeValue(b);
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

export function getDisplayString(d) {
    if (isAutoSetTime(d))
        return d.slice(1,3) + ":" + d.slice(3);
    return d.slice(0,2) + ":" + d.slice(2);
}

function getTimeValue(t) {
    if (isAutoSetTime(t))
        return t.substring(1);
    return t;
}