import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navigator from "./weather/Navigator";
import WeatherHome from "./weather/WeatherHome";
import WeatherLocalisation from "./weather/WeatherLocalisation";
import WeatherCreateMyList from "./weather/WeatherCreateMyList";
import dataimport from "./fetch/dataimport.json";

import sunny from "./images/sunny logo.png";
import pCloudy from "./images/partial cloudy logo.png";
import cloudy from "./images/cloudy logo.png";
import rainy from "./images/rainy logo.png";
import snowy from "./images/snow logo.png";
import night from "./images/night logo.png";
import { useTheme } from "./hook/useTheme";

const menu = ["Home", "Location", "My list"];
const images = [sunny, "", pCloudy, cloudy, rainy, snowy, night];

export const QueryContext = React.createContext();

export default function App() {
  const [activeTab, setActiveTab] = useState(
    parseInt(sessionStorage["lastTab"] ? sessionStorage.getItem("lastTab") : 0),
  );
  const [menuOn, setMenuOn] = useState(false);
  const [menuListOn, setMenuListOn] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(null);
  const [previousBg, setPreviousBg] = useState(null);

  const { toggleTheme, isDarkTheme } = useTheme();

  const [lastSessionListe, setLastSessionListe] = useState(
    JSON.parse(sessionStorage.getItem("lastValue")),
  );

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hourNow = currentDate.getHours();
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

  const baseTimeCalcNow = () => {
    if (hourNow < 10 && hourNow !== 0) {
      if (minutes < 30) {
        return `0${hourNow - 1}00`;
      } else {
        return `0${hourNow}00`;
      }
    } else if (hourNow === 10) {
      if (minutes < 30) {
        return `0${hourNow - 1}00`;
      } else {
        return `${hourNow}00`;
      }
    } else if (hourNow === 0 && minutes < 30) {
      return `2300`;
    } else if (hourNow === 0 && minutes > 30) {
      return "0000";
    } else {
      if (minutes < 30) {
        return `${hourNow - 1}00`;
      } else {
        return `${hourNow}00`;
      }
    }
  };
  const baseTimeCalcForecast = () => {
    if (hourNow < 10 && hourNow !== 0) {
      if (minutes < 30) {
        return `0${hourNow - 1}30`;
      } else {
        return `0${hourNow}30`;
      }
    } else if (hourNow === 10) {
      if (minutes < 30) {
        return `0${hourNow - 1}30`;
      } else {
        return `${hourNow}30`;
      }
    } else if (hourNow === 0 && minutes < 30) {
      return `2330`;
    } else if (hourNow === 0 && minutes > 30) {
      return "0030";
    } else {
      if (minutes < 30) {
        return `${hourNow - 1}30`;
      } else {
        return `${hourNow}30`;
      }
    }
  };

  const baseTimeCalcFuture = () => {
    if (hourNow <= 2) {
      return `2300`;
    } else if (hourNow <= 4) {
      return "0200";
    } else if (hourNow <= 7) {
      return `0500`;
    } else if (hourNow <= 10) {
      return `0800`;
    } else if (hourNow <= 13) {
      return `1100`;
    } else if (hourNow <= 16) {
      return `1400`;
    } else if (hourNow <= 19) {
      return `1700`;
    } else if (hourNow <= 22) {
      return `2000`;
    } else {
      return `2300`;
    }
  };

  const baseTime = baseTimeCalcNow();
  const baseTimeForecast = baseTimeCalcForecast();
  const futureTime = baseTimeCalcFuture();

  const baseDate =
    hourNow === 0 && minutes < 30 ? formattedToday - 1 : formattedToday;

  const baseDateFuture =
    futureTime === "2300" && (hourNow === 0 || hourNow === 1)
      ? formattedToday - 1
      : formattedToday;

  const updateDates = () => {
    hourNow = currentDate.getHours();
    minutes = currentDate.getMinutes();
    if (hourNow === 0 && minutes < 30) {
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
          baseDate,
          baseDateFuture,
          baseTime,
          baseTimeForecast,
          tomorrowDate,
          afterTomorrowDate,
          futureTime,
          toggleTheme,
          isDarkTheme,
          previousBg,
          setPreviousBg,
        }}
      >
        <div
          className={`${previousBg} flex h-screen w-full flex-row items-start justify-start overflow-x-hidden ${
            isDarkTheme ? "bg-perso6" : ""
          }`}
        >
          <Navigator menu={menu} />
          <div className="flex w-full flex-col lg:w-[calc(100%-250px)]">
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
            <div
              className={` ${
                isDarkTheme ? "text-light" : "text-gray-600"
              } mt-2 flex h-10 w-full flex-col self-end bg-inherit pr-10 text-right`}
            >
              <span className="text-xs">
                데이터는 실시간 관측된 자료이며 측정소 현지 사정이나
              </span>
              <span className="text-xs">
                예기치 않은 문제 등으로 오류가 있을 수 있습니다
              </span>
              <div className="flex flex-row justify-end">
                <span className="whitespace-pre text-xs font-bold">
                  데이터 출처:{" "}
                </span>

                <div className="flex flex-col items-start justify-end">
                  <span className="text-xs">
                    - 기상청 (단기예보 조회서비스)
                  </span>
                  <span className="text-xs">- 한국환경공단 (디개오염정보)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueryContext.Provider>
    </Router>
  );
}
