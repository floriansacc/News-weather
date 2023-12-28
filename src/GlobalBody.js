import React, { useState, useEffect } from "react";
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

const menu = ["Home", "Location", "My list"];
const images = [sunny, "", pCloudy, cloudy, rainy, snowy];

export const QueryContext = React.createContext();

export default function GlobalBody() {
  const [activeTab, setActiveTab] = useState(
    parseInt(sessionStorage["lastTab"] ? sessionStorage.getItem("lastTab") : 0),
  );
  const [menuOn, setMenuOn] = useState(false);
  const [menuListOn, setMenuListOn] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(null);

  const [lastSessionListe, setLastSessionListe] = useState(
    JSON.parse(sessionStorage.getItem("lastValue")),
  );

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
    const handleEchap = (e) => {
      if (e.code === "Escape") {
        setMenuListOn(false);
      }
    };
    document.addEventListener("keydown", handleEchap);
    return () => {
      document.removeEventListener("keydown", handleEchap);
    };
  }, []);

  return (
    <QueryContext.Provider
      value={{
        dataimport,
        activeTab,
        setActiveTab,
        menuOn,
        setMenuOn,
        menuListOn,
        setMenuListOn,
        lastSessionListe,
        setLastSessionListe,
        images,
        updateDates,
        serviceKey,
        baseDate,
        baseTime,
        baseTimeForecast,
      }}
    >
      <div className="flex h-screen w-full flex-row items-start justify-start overflow-x-hidden lg:h-screen">
        <Navigator menu={menu} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <WeatherHome
                mouseenter={handleButtonEnter}
                mouseleave={handleButtonLeave}
                resizew={resizeWidth}
              />
            }
          ></Route>
          <Route
            path="/Location"
            element={
              <WeatherLocalisation
                mouseenter={handleButtonEnter}
                mouseleave={handleButtonLeave}
                size="screen"
              />
            }
          ></Route>
          <Route
            path={`/${menu[2]}`}
            element={
              <WeatherCreateMyList
                mouseenter={handleButtonEnter}
                mouseleave={handleButtonLeave}
                resizew={resizeWidth}
              />
            }
          ></Route>
        </Routes>
      </div>
    </QueryContext.Provider>
  );
}
