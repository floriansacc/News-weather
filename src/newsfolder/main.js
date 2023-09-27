import { getWeather, temperatureData } from "./weather.js";
import { todayDate, todayTime } from "./settings.js";
import { getNews } from "./data_call.js";

const getNewsButton = document.getElementById('get-news-button');
const newsInput = document.getElementById('news-input');
const newsBox = document.querySelector('#news-box');

const getWeatherBox = document.getElementById('get-weather-button');
const weatherBox = document.getElementById('weather-box')

const date = new Date();
let hours = date.getHours();

const afficherTemp = async () => {
    const date = todayDate();
    const time = todayTime(hours);
    const x = await getWeather(20230826, 1400);
    weatherBox.innerHTML = `La temperature est de ${x}`;
    console.log(x);
}

getNewsButton.addEventListener('mouseover', e => {
    e.target.style.backgroundColor = '#e6aba5';
    e.target.style.cursor = 'pointer'
})
getNewsButton.addEventListener('mouseout', e => {
    e.target.style.backgroundColor = '';
})
getNewsButton.addEventListener('click', e => {
    e.preventDefault();
    e.target.style.backgroundColor = '#eb847c';
})

getWeatherBox.addEventListener('mouseover', e => {
    e.target.style.backgroundColor = '#e6aba5';
    e.target.style.cursor = 'pointer'
})
getWeatherBox.addEventListener('mouseout', e => {
    e.target.style.backgroundColor = '';
})
getWeatherBox.addEventListener('click', afficherTemp)







