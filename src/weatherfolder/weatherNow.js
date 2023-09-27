import { useEffect, useState } from "react";
import WeatherDisplay from "./weatherDisplay";
import { todayDate } from "../newsfolder/settings";
import styles from "../cssfolder/weather.module.css";

import sunny from "../cssfolder/sunny logo.png";
import pCloudy from "../cssfolder/partial cloudy logo.png";
import cloudy from "../cssfolder/cloudy logo.png";
import rainy from "../cssfolder/rainy logo.png";

const images = [sunny, "", pCloudy, cloudy, rainy];

export default function WeatherNow() {
  const [weatherInfoNow, setWeatherInfoNow] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [imgSrc, setImgSrc] = useState(0);
  const [locationCity, setLocationCity] = useState("Jeonju");
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
  const serviceKey = process.env.REACT_APP_WEATHER_KEY
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
    } else {
      if (minutes < 30) {
        return `${hours - 1}00`;
      } else {
        return `${hours}00`;
      }
    }
  };
  const baseTimeCalcForecast = () => {
    if (hours < 10) {
      return `0${hours - 1}00`;
    } else {
      return `${hours - 1}00`;
    }
  };

  const updateDates = () => {
    hours = date.getHours();
    minutes = date.getMinutes();
    day = date.getDate();
  };
  const baseTime = baseTimeCalcNow();
  const baseTimeForecast = baseTimeCalcForecast();
  const nx = 63;
  const ny = 89;

  const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=${numbRow}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=${numbRow}&dataType=JSON&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${nx}&ny=${ny}`;

  const handleReset = (e) => {
    setWeatherInfoNow([]);
    setWeatherForecast([]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
  };

  const handleRefresh = (e) => {
    setWeatherInfoNow([]);
    setWeatherForecast([]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setRefreshData((prev) => prev + 1);
    //{ isLoadedForecast && handlePhotoChange() }
  };
  /* 
  const handlePhotoChange = () => {
    if (weatherForecast[0].value === 1) {
      setImgSrc(4);
      window.console.log(`OUI`)
    } else {
      setImgSrc(`${weatherForecast[7].value - 1}`);
      window.console.log(`OUI${weatherForecast[7].value - 1}`)
    }
  };*/

  const handleDisplayCity = (e) => {
    setLocationCity(e.target.value);
  };

  useEffect(() => {
    updateDates();
    const getWeather = async () => {
      try {
        const response = await fetch(getUrlWeatherNow, {});
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log(jsonResponse)
        window.console.log(jsonResponse.response.header);
        window.console.log(jsonResponse.response.body.items.item);
        await jsonResponse.response.body.items.item.forEach((x) => {
          setWeatherInfoNow((prev) => [
            ...prev,
            {
              category: x.category,
              value: x.obsrValue,
            },
          ]);
        });
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
        setIsLoaded(false);
      }
    };
    window.console.log(baseTime);
    window.console.log(minutes);
    getWeather();
    return () => {
      setIsLoaded(false);
    };
  }, [refreshData]);

  useEffect(() => {
    updateDates();
    const getWeather2 = async () => {
      try {
        const response = await fetch(getUrlWeatherForecast, {});
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log(jsonResponse.response.header);
        window.console.log(jsonResponse.response.body.items.item);
        const getData = await jsonResponse.response.body.items.item.forEach(
          (x) => {
            if (x.category === "PTY" || x.category === "SKY") {
              setWeatherForecast((prev) => [
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
        window.console.log(weatherForecast);
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
    <div className={styles.container2}>
      <WeatherDisplay
        displaycity={handleDisplayCity}
        city={locationCity}
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
        sky={weatherForecast[7]}
      />
      {!isLoaded && <p>Fetching</p>}
    </div>
  );
}
