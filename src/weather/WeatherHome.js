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
import Navigator from "./Navigator";

const images = [sunny, "", pCloudy, cloudy, rainy];

export default function WeatherHome() {
  const [activeTab, setActiveTab] = useState(0);
  const [menuOn, setMenuOn] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(null);

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
    } else if (hours === 0 && minutes > 30) {
      return "0000";
    } else {
      if (minutes < 30) {
        return `${hours - 1}00`;
      } else {
        return `${hours}00`;
      }
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
    } else if (hours === 0 && minutes > 30) {
      return "0030";
    } else {
      if (minutes < 30) {
        return `${hours - 1}30`;
      } else {
        return `${hours}30`;
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

  useEffect(() => {
    const handleResize = () => {
      setResizeWidth(window.innerWidth);
      window.console.log(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    setResizeWidth(window.innerWidth);
    window.console.log(window.innerWidth);
  }, []);

  return (
    <div className="flex h-full w-full flex-row items-center justify-center ">
      <Navigator
        menuon={menuOn}
        setmenuon={setMenuOn}
        activetab={activeTab}
        setactivetab={setActiveTab}
      />
      <div
        className={`flex w-full flex-col items-center justify-center bg-red-400 ${
          activeTab === 1 ? "h-screen" : "h-fit"
        }`}
        onClick={() => (menuOn ? setMenuOn(false) : null)}
      >
        <div className="flex h-full w-11/12 flex-row flex-wrap items-start justify-around bg-slate-100 sm:w-full sm:flex-col sm:items-center md:w-full md:flex-wrap lg:m-2">
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
            resizew={resizeWidth}
          />
        </div>
      </div>
    </div>
  );
}
