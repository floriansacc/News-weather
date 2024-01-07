import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navigator from "./weather/Navigator";
import WeatherHome from "./weather/WeatherHome";
import WeatherLocalisation from "./weather/WeatherLocalisation";
import WeatherCreateMyList from "./weather/WeatherCreateMyList";
import dataimport from "./weather/dataimport.json";

import sunny from "./images/sunny logo.png";
import pCloudy from "./images/partial cloudy logo.png";
import cloudy from "./images/cloudy logo.png";
import rainy from "./images/rainy logo.png";
import snowy from "./images/snow logo.png";

const menu = ["Home", "Location", "My list"];
const images = [sunny, "", pCloudy, cloudy, rainy, snowy];

export const QueryContext = React.createContext();

export default function App() {
  const [activeTab, setActiveTab] = useState(
    parseInt(sessionStorage["lastTab"] ? sessionStorage.getItem("lastTab") : 0),
  );
  const [menuOn, setMenuOn] = useState(false);
  const [menuListOn, setMenuListOn] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(null);

  const [lastSessionListe, setLastSessionListe] = useState(
    JSON.parse(sessionStorage.getItem("lastValue")),
  );

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
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
  let tomorrowDaytoChange = String(tomorrow.getDate()).padStart(2, "0");
  let tomorrowDate = `${tomorrowYear}${tomorrowMonth}${tomorrowDaytoChange}`;

  let afterTomorrow = new Date(currentDate);
  afterTomorrow.setDate(currentDate.getDate() + 2);
  let afterTomorrowYear = afterTomorrow.getFullYear();
  let afterTomorrowMonth = String(afterTomorrow.getMonth() + 1).padStart(
    2,
    "0",
  ); // Adding 1 because months are zero-based
  let afterTomorrowDaytoChange = String(afterTomorrow.getDate()).padStart(
    2,
    "0",
  );
  let afterTomorrowDate = `${afterTomorrowYear}${afterTomorrowMonth}${afterTomorrowDaytoChange}`;

  const baseDate =
    hours === 0 && minutes < 30 ? formattedToday - 1 : formattedToday;

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

  const baseTimeCalcFuture = () => {
    if (hours <= 2) {
      return `2300`;
    } else if (hours <= 4) {
      return "0200";
    } else if (hours <= 7) {
      return `0500`;
    } else if (hours <= 10) {
      return `0800`;
    } else if (hours <= 13) {
      return `1100`;
    } else if (hours <= 16) {
      return `1400`;
    } else if (hours <= 19) {
      return `1700`;
    } else if (hours <= 22) {
      return `2000`;
    } else {
      return `2300`;
    }
  };

  const baseTime = baseTimeCalcNow();
  const baseTimeForecast = baseTimeCalcForecast();
  const futureTime = baseTimeCalcFuture();

  const updateDates = () => {
    hours = currentDate.getHours();
    minutes = currentDate.getMinutes();
    if (hours === 0 && minutes < 30) {
      day = currentDate.getDate() - 1;
    } else {
      day = currentDate.getDate();
    }
  };

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
    <Router>
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
          tomorrowDate,
          afterTomorrowDate,
          futureTime,
        }}
      >
        <div className="h-dvh w-fullflex-row flex items-start justify-start overflow-x-hidden lg:h-screen">
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
    </Router>
  );
}
