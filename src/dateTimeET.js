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
    return timeNow.getHours() + ":" + timeNow.getMinutes(); // + ":" + timeNow.getSeconds();
}

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

//ekspordin kõik vajaliku
module.exports = { fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekDayNowET, partOfDay: partOfDay };