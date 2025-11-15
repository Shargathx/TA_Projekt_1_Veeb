const { time } = require("console");

const monthNamesET = [
    "jaanuar",
    "veebruar",
    "märts",
    "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
const weekdayNamesEt = [
    "pühapäev",
    "esmaspäev",
    "teisipäev",
    "kolmapäev",
    "neljapäev",
    "reede",
    "laupäev"
];

const dateNowFormattedET = function () {
    let timeNow = new Date();
    return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const timeNowFormattedET = function () {
    let timeNow = new Date();
    const hours = timeNow.getHours();
    const minutes = String(timeNow.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const weekDayNowET = function () {
    let timeNow = new Date();
    return weekdayNamesEt[timeNow.getDay()];
}

const partOfDay = function () {
    const hour = new Date().getHours();
    let partOfDay = "Suvaline aeg";

    if (hour >= 0 && hour < 6) {
        partOfDay = "varahommik";
    } else if (hour >= 6 && hour < 12) {
        partOfDay = "hommik";
    } else if (hour >= 12 && hour < 15) {
        partOfDay = "keskpäev";
    } else if (hour >= 15 && hour < 18) {
        partOfDay = "pärastlõuna";
    } else if (hour >= 18 && hour <= 23) {
        partOfDay = "õhtupoolik";
    }
    return partOfDay;
}

function getFutureDate(days = 0) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

//ekspordin kõik vajaliku
module.exports = { fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekDayNowET, partOfDay: partOfDay, getFutureDate };