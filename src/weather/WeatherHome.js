import { useEffect, useState } from "react";
import WeatherUID from "./WeatherUID";
import { todayDate } from "../news/settings";
import dataimport from "./dataimport.json";

import sunny from "../css/sunny logo.png";
import pCloudy from "../css/partial cloudy logo.png";
import cloudy from "../css/cloudy logo.png";
import rainy from "../css/rainy logo.png";
import WeatherCreateMyList from "./WeatherCreateMyList";

const images = [sunny, "", pCloudy, cloudy, rainy];

export default function WeatherHome() {
  const [weatherInfoNow, setWeatherInfoNow] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [skyForecast, setSkyForecast] = useState([]);
  const [tempForecast, setTempForecast] = useState([]);
  const [locationCity, setLocationCity] = useState([0, 63, 89]);
  const [citySelector, setCitySelector] = useState(["선택", "", "", 63, 89]);
  const [refreshData, setRefreshData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);

  const date = new Date();

  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const serviceKey = process.env.REACT_APP_WEATHER_KEY;
  const numbRow = 60;
  const pageNo = 1;
  const baseDate = todayDate();
  const baseTimeCalcNow = () => {
    if (hours < 10) {
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
    day = date.getDate();
  };

  const baseTimeCalcForecast = () => {
    if (hours <= 10) {
      return `0${hours - 1}00`;
    } else {
      return `${hours - 1}00`;
    }
  };

  const baseTime = baseTimeCalcNow();
  const baseTimeForecast = baseTimeCalcForecast();
  const nx = citySelector[3];
  const ny = citySelector[4];

  const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=${numbRow}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=${numbRow}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${nx}&ny=${ny}`;

  const handleReset = (e) => {
    setWeatherInfoNow([]);
    setWeatherForecast([]);
    setTempForecast([]);
    setSkyForecast([]);
    setCitySelector(["선택", "", "", 63, 89]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
  };

  const handleRefresh = (e) => {
    setWeatherInfoNow([]);
    setWeatherForecast([]);
    setTempForecast([]);
    setSkyForecast([]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setRefreshData((prev) => prev + 1);
  };

  const handleCitySelector = (e) => {
    if (e.target.name === "one") {
      setCitySelector(["선택"]);
      setCitySelector([e.target.value]);
    } else if (e.target.name === "two") {
      setCitySelector([citySelector[0], e.target.value]);
    } else if (e.target.name === "three") {
      let [coord] = Array.from(
        new Set(
          dataimport
            .filter((word) => word.Part3 === e.target.value)
            .map((x) => [x.nx, x.ny])
        )
      );
      setCitySelector([
        citySelector[0],
        citySelector[1],
        e.target.value,
        coord[0],
        coord[1],
      ]);
      handleRefresh();
    }
  };

  const handleDisplayInfo = () => {
    window.console.log(weatherInfoNow);
    window.console.log(weatherForecast);
    window.console.log(tempForecast);
    window.console.log(skyForecast);
    window.console.log(citySelector);
    window.console.log(baseDate);
    window.console.log(baseTime);
    window.console.log(minutes);
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
    updateDates();
    const getWeather = async () => {
      try {
        const response = await fetch(getUrlWeatherNow, {
          headers: {
            Accept: "application / json",
          },
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log(jsonResponse.response.header);
        window.console.log(jsonResponse.response.body.items.item);
        await jsonResponse.response.body.items.item.forEach((x) => {
          setWeatherInfoNow((prev) => [
            ...prev,
            {
              category: x.category,
              value: x.obsrValue,
              time: x.baseTime,
              nx: x.nx,
              ny: x.ny,
            },
          ]);
        });
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
        setIsLoaded(false);
      }
    };
    getWeather();
    return () => {
      setIsLoaded(false);
    };
  }, [refreshData]);

  useEffect(() => {
    updateDates();
    const getWeather2 = async () => {
      try {
        const response = await fetch(getUrlWeatherForecast, {
          headers: {
            Accept: "application / json",
          },
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log(jsonResponse.response.header);
        window.console.log(jsonResponse.response.body.items.item);
        const getData = await jsonResponse.response.body.items.item.forEach(
          (x) => {
            if (x.category === "PTY") {
              setWeatherForecast((prev) => [
                ...prev,
                {
                  category: x.category,
                  time: x.fcstTime,
                  value: x.fcstValue,
                  basetime: x.baseTime,
                },
              ]);
            } else if (x.category === "T1H") {
              setTempForecast((prev) => [
                ...prev,
                {
                  category: x.category,
                  time: x.fcstTime,
                  value: x.fcstValue,
                  basetime: x.baseTime,
                },
              ]);
            } else if (x.category === "SKY") {
              setSkyForecast((prev) => [
                ...prev,
                {
                  category: x.category,
                  time: x.fcstTime,
                  value: x.fcstValue,
                  basetime: x.baseTime,
                },
              ]);
            }
          }
        );
        setIsLoadedForecast(true);
      } catch (error) {
        console.log(error);
        setIsLoadedForecast(false);
      }
    };
    getWeather2();
    return () => {
      setIsLoadedForecast(false);
    };
  }, [refreshData]);

  return (
    <div className="flex sm:flex-col flex-row flex-nowrap justify-around sm:items-center items-start sm:m-4 m-8 h-fit sm:w-full w-11/12 bg-slate-400">
      <p className="text-3xl text-red-700">공사중</p>

      <WeatherUID
        handlecityselector={handleCitySelector}
        cityselector={citySelector}
        dataimport={dataimport}
        displayinfo={handleDisplayInfo}
        srcimage={images}
        loadstate={isLoaded}
        loadforecast={isLoadedForecast}
        reset={handleReset}
        refresh={handleRefresh}
        raincond={weatherInfoNow[0]}
        humidity={weatherInfoNow[1]}
        hourrain={weatherInfoNow[2]}
        temp={weatherInfoNow[3]}
        winddir={weatherInfoNow[5]}
        windspeed={weatherInfoNow[7]}
        tempforecast={tempForecast}
        skyforecast={skyForecast}
        rainforecast={weatherForecast}
        mouseenter={handleButtonEnter}
        mouseleave={handleButtonLeave}
        showbutton={true}
        titlename={false}
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
      />
    </div>
  );
}
