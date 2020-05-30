const cookieName = "cheekyCalendarData";
const addonString = ";samesite=strict"
export function getCookie() {
    return document.cookie.split('; ')
        .find(row => row.startsWith(cookieName))
        .split('=')[1];
}

export function setCookie(d) {
    document.cookie = cookieName + "=" + JSON.stringify(d) + addonString;
}