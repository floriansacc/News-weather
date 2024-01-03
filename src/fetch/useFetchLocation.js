import { useState, useEffect, useContext } from "react";
import { QueryContext } from "../App";

export default function useFetchLocation(city, isLocated, refreshFetch) {
  const {
    serviceKey,
    baseDate,
    tomorrowDate,
    afterTomorrowDate,
    baseTime,
    baseTimeForecast,
    futureTime,
  } = useContext(QueryContext);

  const [weatherInfoNow, setWeatherInfoNow] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [skyForecast, setSkyForecast] = useState([]);
  const [tempForecast, setTempForecast] = useState([]);
  const [highestNextDays, setHighestNextDays] = useState([]);
  const [tempNextDays, setTempNextDays] = useState([]);
  const [skyNextDays, setSkyNextDays] = useState([]);
  const [rainNextDays, setRainNextDays] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);
  const [isForecasted, setisForecasted] = useState(false);
  const [canRefersh, setCanRefresh] = useState(null);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const weatherNextDay =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  useEffect(() => {
    const getWeather = async () => {
      const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${city[3]}&ny=${city[4]}`;
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
        window.console.log([
          `Geolocation ${city}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        await jsonResponse.response.body.items.item.forEach((x) => {
          setWeatherInfoNow((prev) => [
            ...prev,
            {
              ny: x.ny,
              Phase1: city[0],
              Phase2: city[1],
              Phase3: city[2],
              category: x.category,
              value: x.obsrValue,
              time: x.baseTime,
              nx: x.nx,
            },
          ]);
        });
      } catch (error) {
        setIsLoaded(false);
        window.console.log(error);
        return Promise.reject(error);
      }
    };
    const getWeather2 = async () => {
      const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${city[3]}&ny=${city[4]}`;
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
        window.console.log([
          `Geolocation Forecast ${city}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        await jsonResponse.response.body.items.item.forEach((x) => {
          let newData = {
            Phase1: city[0],
            Phase2: city[1],
            Phase3: city[2],
            category: x.category,
            time: x.fcstTime,
            value: x.fcstValue,
            baseTime: x.baseTime,
          };
          if (x.category === "PTY") {
            setWeatherForecast((prev) => [...prev, newData]);
          } else if (x.category === "T1H") {
            setTempForecast((prev) => [...prev, newData]);
          } else if (x.category === "SKY") {
            setSkyForecast((prev) => [...prev, newData]);
          }
        });
      } catch (error) {
        setIsLoadedForecast(false);
        return Promise.reject(error);
      }
    };
    if (isLocated) {
      Promise.all([getWeather(), getWeather2()])
        .then(() => {
          setIsLoaded(true);
          setIsLoadedForecast(true);
          setCanRefresh(true);
          window.console.log("Geolocation all fetched");
        })
        .catch((e) => {
          window.console.log(`Geolocation fetch error: ${e}`);
          setIsLoaded(false);
          setIsLoadedForecast(false);
          setCanRefresh(true);
        });
    }
    return () => {
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setCanRefresh(false);
    };
  }, [isLocated, refreshFetch]);

  useEffect(() => {
    const getWeather3 = async () => {
      const getUrlWeatherNextDay = `${weatherNextDay}?serviceKey=${serviceKey}&numOfRows=800&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${futureTime}&nx=${city[3]}&ny=${city[4]}`;
      try {
        const response = await fetch(getUrlWeatherNextDay, {
          headers: {
            Accept: "application / json",
          },
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log([
          `Geolocation next day ${city}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        await jsonResponse.response.body.items.item.forEach((x, i) => {
          let newData = {
            Phase1: city[0],
            Phase2: city[1],
            Phase3: city[2],
            category: x.category,
            date: x.fcstDate,
            value: x.fcstValue,
            time: x.fcstTime,
          };
          if (
            (x.category === "TMN" || x.category === "TMX") &&
            (x.fcstDate === tomorrowDate || x.fcstDate === afterTomorrowDate)
          ) {
            setHighestNextDays((prev) => [...prev, newData]);
          } else if (
            x.category === "TMP" &&
            (x.fcstDate === baseDate ||
              x.fcstDate === tomorrowDate ||
              x.fcstDate === afterTomorrowDate)
          ) {
            setTempNextDays((prev) => [...prev, newData]);
          } else if (
            x.category === "SKY" &&
            (x.fcstDate === baseDate ||
              x.fcstDate === tomorrowDate ||
              x.fcstDate === afterTomorrowDate)
          ) {
            setSkyNextDays((prev) => [...prev, newData]);
          } else if (
            x.category === "PTY" &&
            (x.fcstDate === baseDate ||
              x.fcstDate === tomorrowDate ||
              x.fcstDate === afterTomorrowDate)
          ) {
            setRainNextDays((prev) => [...prev, newData]);
          }
        });
      } catch (error) {
        window.console.log(error);
        setIsLoaded(false);
        return Promise.reject(error);
      }
    };
    if (isLocated) {
      Promise.all([getWeather3()])
        .then(() => {
          setisForecasted(true);
        })
        .catch((e) => {
          window.console.log(e);
          setisForecasted(false);
        });
    }
    return () => {
      setisForecasted(false);
    };
  }, [isLocated, refreshFetch]);

  return {
    weatherInfoNow,
    setWeatherInfoNow,
    weatherForecast,
    setWeatherForecast,
    skyForecast,
    setSkyForecast,
    tempForecast,
    setTempForecast,
    highestNextDays,
    setHighestNextDays,
    tempNextDays,
    setTempNextDays,
    skyNextDays,
    setSkyNextDays,
    rainNextDays,
    setRainNextDays,
    isLoaded,
    setIsLoaded,
    isLoadedForecast,
    setIsLoadedForecast,
    isForecasted,
    setisForecasted,
    canRefersh,
  };
}
