let currentDate = new Date();
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();

let todayYear = currentDate.getFullYear();
let todayMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
let todayDay = String(currentDate.getDate()).padStart(2, "0");
let formattedToday = `${todayYear}${todayMonth}${todayDay}`;

let tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);

let tomorrowYear = tomorrow.getFullYear();
let tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
let tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
let formattedTomorrow = `${tomorrowYear}${tomorrowMonth}${tomorrowDay}`;

const futureTime = (hour) => {
  if (hour <= 2) {
    return `no data`;
  } else if (hour <= 4) {
    return "0200";
  } else if (hour <= 7) {
    return `0500`;
  } else if (hour <= 10) {
    return `0800`;
  } else if (hour <= 13) {
    return `1100`;
  } else if (hour <= 16) {
    return `1400`;
  } else if (hour <= 19) {
    return `1700`;
  } else if (hour <= 22) {
    return `2000`;
  } else {
    return `2300`;
  }
};
console.log(todayTime(hours));
console.log(minutes);
console.log(formattedToday);
console.log(formattedTomorrow);

export {
  todayTime,
  formattedToday as todayDate,
  formattedTomorrow as tomorrowDay,
  hours,
  minutes,
};
