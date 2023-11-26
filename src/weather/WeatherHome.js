import { useEffect, useState } from "react";
import WeatherUID from "./WeatherUID";
import { todayDate } from "../news/settings";
import dataimport from "./dataimport.json";

import sunny from "../css/sunny logo.png";
import pCloudy from "../css/partial cloudy logo.png";
import cloudy from "../css/cloudy logo.png";
import rainy from "../css/rainy logo.png";
import WeatherCreateMyList from "./WeatherCreateMyList";
import WeatherLocalisation from "./WeatherLocalisation";

const images = [sunny, "", pCloudy, cloudy, rainy];

export default function WeatherHome() {
  const [activeTab, setActiveTab] = useState(2);

  const date = new Date();

  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;
  const baseDate = hours === 0 && minutes < 30 ? todayDate() - 1 : todayDate();
  const baseTimeCalcNow = () => {
    if (hours < 10 && hours !== 0) {
      if (minutes < 30) {
        return `0${hours - 1}00`;
      } else {
        return `0${hours}00`;
      }
    } else if (hours === 10) {
      if (minutes < 30) {
        return `0${hours - 1}00`;
      } else {
        return `${hours}00`;
      }
    } else if (hours === 0 && minutes < 30) {
      return `2300`;
    } else {
      if (minutes < 30) {
        return `${hours - 1}00`;
      } else {
        return `${hours}00`;
      }
    }
  };
  const updateDates = () => {
    hours = date.getHours();
    minutes = date.getMinutes();
    if (hours === 0 && minutes < 30) {
      day = date.getDate() - 1;
    } else {
      day = date.getDate();
    }
  };

  const baseTimeCalcForecast = () => {
    if (hours < 10 && hours !== 0) {
      if (minutes < 30) {
        return `0${hours - 1}30`;
      } else {
        return `0${hours}30`;
      }
    } else if (hours === 10) {
      if (minutes < 30) {
        return `0${hours - 1}30`;
      } else {
        return `${hours}30`;
      }
    } else if (hours === 0 && minutes < 30) {
      return `2330`;
    } else {
      if (minutes < 30) {
        return `${hours - 1}30`;
      } else {
        return `${hours}30`;
      }
    }
  };

  const baseTime = baseTimeCalcNow();
  const baseTimeForecast = baseTimeCalcForecast();

  const handleButtonEnter = (e) => {
    e.target.style.cursor = "pointer";
    e.target.style.filter = "contrast(90%)";
  };

  const handleButtonLeave = (e) => {
    e.target.style.cursor = "";
    e.target.style.filter = "";
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full ">
      <div className="flex flex-row justify-center w-full">
        <p className="text-4xl text-red-700">공사중</p>
        <button
          className={`flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full  transition-all duration-150 ease-in delay-0 md:hover:bg-yellow-100 lg:hover:bg-yellow-100 ${
            activeTab === 0
              ? "bg-gradient-to-r from-gray-300 to-yellow-200"
              : "bg-gray-400 sm:animate-none  md:hover:animate-pulse lg:hover:animate-pulse"
          }`}
          onClick={() => (activeTab === 0 ? setActiveTab(2) : setActiveTab(0))}
        >
          Localisation
        </button>
        <button
          className={`flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full  transition-all duration-150 ease-in delay-0 md:hover:bg-yellow-100 lg:hover:bg-yellow-100 ${
            activeTab === 1
              ? "bg-gradient-to-r from-gray-300 to-yellow-200"
              : "bg-gray-400 sm:animate-none  md:hover:animate-pulse lg:hover:animate-pulse"
          }`}
          onClick={() => (activeTab === 1 ? setActiveTab(2) : setActiveTab(1))}
        >
          My List
        </button>
      </div>
      <div className="flex sm:flex-col flex-row md:flex-wrap flex-nowrap justify-around sm:items-center items-start sm:m-4 md:m-4 m-8 h-fit sm:w-full w-11/12 bg-slate-100">
        <WeatherLocalisation
          dataimport={dataimport}
          mouseenter={handleButtonEnter}
          mouseleave={handleButtonLeave}
          basetime={baseTime}
          basetimeforecast={baseTimeForecast}
          servicekey={serviceKey}
          srcimage={images}
          updatedate={updateDates}
          basedate={baseDate}
          activetab={activeTab}
        />
        <WeatherCreateMyList
          dataimport={dataimport}
          mouseenter={handleButtonEnter}
          mouseleave={handleButtonLeave}
          basetime={baseTime}
          basetimeforecast={baseTimeForecast}
          servicekey={serviceKey}
          srcimage={images}
          updatedate={updateDates}
          basedate={baseDate}
          activetab={activeTab}
        />
      </div>
    </div>
  );
}
