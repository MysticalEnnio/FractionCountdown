/*
start: 17.8.22
end: 1.6.23
*/
//#region Config
const start = "8/17/2022";
const end = "6/1/23";
//#endregion

//#region Helper Variables
let now = Date.now();
let startDate = new Date(start);
let endDate = new Date(end);
let precision = 5;
let typeNumber = 1;
let updateInterval;

let precisionToValue = new Map([
    [1, 0.1],
    [2, 0.01],
    [3, 0.001],
    [4, 0.0001],
    [5, 0.00001],
    [6, 0.000001],
    [7, 0.0000001],
    [8, 0.00000001],
    [9, 0.000000001],
]);

let precisionValue = precisionToValue.get(precision);

let outputElement = document.getElementById("output");
let precisionElement = document.getElementById("precisionSlider");
let toolbarElement = document.getElementById("toolbar");
//#endregion

//#region functions
function getDifference(start, end) {
    return Math.abs(end - start);
}

//difference to date
function diffToDate(diff) {
    let years = Math.floor(diff / 31536000000);
    diff = diff - years * 31536000000;
    let months = Math.floor(diff / 2628000000);
    diff = diff - months * 2628000000;
    let days = Math.floor(diff / 86400000);
    diff = diff - days * 86400000;
    let hours = Math.floor(diff / 3600000);
    diff = diff - hours * 3600000;
    let minutes = Math.floor(diff / 60000);
    diff = diff - minutes * 60000;
    let seconds = Math.floor(diff / 1000);
    diff = diff - seconds * 1000;

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
    };
}

//decimal to fraction
function decToFrac(dec) {
    var tolerance = precisionValue;
    1.0e-6; //0.000001
    var h1 = 1;
    var h2 = 0;
    var k1 = 0;
    var k2 = 1;
    var b = dec;
    do {
        var a = Math.floor(b);
        var aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(dec - h1 / k1) > dec * tolerance);

    return h1 + "/" + k1;
}

function startInterval(func) {
    func();
    updateInterval = setInterval(func, 1000);
}

function stopInterval() {
    if (updateInterval) {
        console.log("clearInterval");
        clearInterval(updateInterval);
    }
}
//#endregion

//#region fraction calculations
let startEndDiff = getDifference(endDate.getTime(), startDate.getTime());
console.log("difference between start and end: ", diffToDate(startEndDiff));

let nowStartDiff = getDifference(now, startDate.getTime());
console.log("difference between now and start: ", diffToDate(nowStartDiff));

function calculateFraction() {
    now = Date.now();
    nowStartDiff = getDifference(now, startDate.getTime());
    return decToFrac(Math.floor(nowStartDiff) / Math.floor(startEndDiff));
}

function updateFraction(adjustPrecision = false) {
    if (adjustPrecision) {
        console.log("updateFraction");
        precision = document.getElementById("precisionInput").value;
        precisionValue = precisionToValue.get(Number(precision));
        console.log("precision: ", precision);
        console.log("precisionValue: ", precisionValue);
    }
    console.log("updateFraction", precision);
    let outputElement = document.getElementById("output");
    outputElement.innerHTML = calculateFraction();
}
//#endregion

//#region countdown calculations
function calculateCountdown() {
    now = Date.now();
    let diff = getDifference(endDate.getTime(), now);
    return diffToDate(diff);
}

function updateCountdown() {
    console.log("updateCountdown");
    let diff = calculateCountdown();
    outputElement.innerHTML = `${diff.months}M ${diff.days}D ${diff.hours}H ${diff.minutes}M ${diff.seconds}S`;
}
//#endregion

//#region seconds calculations
function calculateSeconds() {
    now = Date.now();
    let diff = endDate.getTime() - now;
    return Math.floor(diff / 1000);
}

function updateSeconds() {
    console.log("updateSeconds");
    let diff = calculateSeconds();
    outputElement.innerHTML = diff + " seconds";
}
//#endregion

//#region hours calculations
function calculateHours() {
    now = Date.now();
    let diff = endDate.getTime() - now;
    return Math.floor(diff / 3600000);
}

function updateHours() {
    console.log("updateHours");
    let diff = calculateHours();
    outputElement.innerHTML = diff + " hours";
}
//#endregion

//#region days calculations
function calculateDays() {
    now = Date.now();
    let diff = endDate.getTime() - now;
    return Math.floor(diff / 86400000);
}

function updateDays() {
    console.log("updateDays");
    let diff = calculateDays();
    outputElement.innerHTML = diff + " days";
}
//#endregion

//#region output type
let outputTypes = new Map([
    [
        1,
        {
            type: "fraction",
            func: updateFraction,
            fontSize: "text-[16vw]",
            precision: true,
        },
    ],
    [
        2,
        {
            type: "countdown",
            func: updateCountdown,
            fontSize: "text-[10vw]",
            precision: false,
        },
    ],
    [
        3,
        {
            type: "seconds",
            func: updateSeconds,
            fontSize: "text-[10vw]",
            precision: false,
        },
    ],
    [
        4,
        {
            type: "hours",
            func: updateHours,
            fontSize: "text-[10vw]",
            precision: false,
        },
    ],
    [
        5,
        {
            type: "days",
            func: updateDays,
            fontSize: "text-[10vw]",
            precision: false,
        },
    ],
]);

function changeType(type) {
    if (type > outputTypes.size) typeNumber--;
    if (type < 1) typeNumber++;
    type = typeNumber;
    console.log("changeType", type);
    stopInterval();
    outputElement.className = "";
    outputElement.classList.add(outputTypes.get(type).fontSize);
    if (outputTypes.get(type).precision) {
        precisionElement.classList.remove("hidden");
        toolbarElement.classList.add("grid-rows-2");
        toolbarElement.classList.remove("grid-rows-1");
    } else {
        precisionElement.classList.add("hidden");
        toolbarElement.classList.remove("grid-rows-2");
        toolbarElement.classList.add("grid-rows-1");
    }
    startInterval(outputTypes.get(type).func);
}

var nextType = () => changeType(++typeNumber);
var prevType = () => changeType(--typeNumber);
//#endregion

changeType(typeNumber);
