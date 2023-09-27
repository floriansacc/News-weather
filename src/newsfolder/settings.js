const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let hours = date.getHours();
let minutes = date.getMinutes();


const todayDate = () => {
    let months;
    if (month < 10) {
        months = `0${month}`;
    }
    return `${year}${months}${day}`
}


const todayTime = hour => {
    if (hour <= 2) {
        return `no data`
    } else if (hour <= 4) {
        return '0200'
    } else if (hour <= 7) {
        return `0500`
    } else if (hour <= 10) {
        return `0800`
    } else if (hour <= 13) {
        return `1100`
    } else if (hour <= 16) {
        return `1400`
    } else if (hour <= 19) {
        return `1700`
    } else if (hour <= 22) {
        return `2000`
    } else {
        return `2300`
    }
}


export { todayTime, todayDate, hours, minutes }
