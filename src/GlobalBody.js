import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navigator from "./weather/Navigator";
import WeatherHome from "./weather/WeatherHome";
import WeatherLocalisation from "./weather/WeatherLocalisation";
import WeatherCreateMyList from "./weather/WeatherCreateMyList";
import dataimport from "./weather/dataimport.json";
import { todayDate } from "./news/settings";

import sunny from "./css/sunny logo.png";
import pCloudy from "./css/partial cloudy logo.png";
import cloudy from "./css/cloudy logo.png";
import rainy from "./css/rainy logo.png";
import snowy from "./css/snow logo.png";

const images = [sunny, "", pCloudy, cloudy, rainy, snowy];

export default function GlobalBody() {
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
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    setResizeWidth(window.innerWidth);
  }, []);
  //overflow-x-hidden
  return (
    <div className="flex h-full w-full flex-row items-start justify-start overflow-x-hidden lg:h-screen">
      <Navigator
        menuon={menuOn}
        setmenuon={setMenuOn}
        activetab={activeTab}
        setactivetab={setActiveTab}
      />
      <Routes>
        <Route
          exact
          path="/News-Weather"
          element={
            <WeatherHome
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
              menuon={menuOn}
              setmenuon={setMenuOn}
              setactivetab={setActiveTab}
            />
          }
        ></Route>
        <Route
          path="/News-weather/Location"
          element={
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
              menuon={menuOn}
              setmenuon={setMenuOn}
              size="screen"
            />
          }
        ></Route>
        <Route
          path="/News-weather/My-list"
          element={
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
              menuon={menuOn}
              setmenuon={setMenuOn}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}
