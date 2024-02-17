import { useState, useEffect, useContext } from "react";
import { QueryContext } from "../layout/RootLayout";

export default function useFetchLocation(city, isLocated, refreshFetch) {
  const {
    baseDate,
    baseDateFuture,
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
  const [accuRain, setAccuRain] = useState([]);
  const [accuSnow, setAccuSnow] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);
  const [isForecasted, setIsForecasted] = useState(false);
  const [canRefersh, setCanRefresh] = useState(null);

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  const weatherUrlNow =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const weatherNextDay =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  useEffect(() => {
    const getWeather = async (signal) => {
      const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${city[3]}&ny=${city[4]}`;
      try {
        const response = await fetch(getUrlWeatherNow, {
          signal: signal,
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();

        await jsonResponse.response.body.items.item.forEach((x, i) => {
          if (i === 0) {
            setWeatherInfoNow([]);
          }
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
        console.log(error);
        return Promise.reject(error);
      }
    };
    if (isLocated) {
      let fetchAll = async (attempt = 1) => {
        const abortController = new AbortController();
        console.log("try fetch Weather 1", attempt);
        try {
          await getWeather(abortController.signal);
          setIsLoaded(true);
          setCanRefresh(true);
        } catch (e) {
          console.log(e);
          const maxRetries = 3;
          if (attempt < maxRetries) {
            setTimeout(() => {
              console.log(`Retry attempt Weather 1: ${attempt}`);
              fetchAll(attempt + 1);
            }, 3000);
          }
          setIsLoaded(false);
          setCanRefresh(true);
        }
      };
      fetchAll();
    }
    return () => {
      // setIsLoaded(false);
      // setIsLoadedForecast(false);
      setCanRefresh(false);
    };
  }, [isLocated, refreshFetch]);

  useEffect(() => {
    const getWeather2 = async (signal) => {
      const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${city[3]}&ny=${city[4]}`;
      try {
        const response = await fetch(getUrlWeatherForecast, {
          signal: signal,
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();

        await jsonResponse.response.body.items.item.forEach((x, i) => {
          if (i === 0) {
            setWeatherForecast([]);
            setTempForecast([]);
            setSkyForecast([]);
          }
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
      let fetchAll = async (attempt = 1) => {
        const abortController = new AbortController();
        console.log("try fetch Weather 2", attempt);
        try {
          await getWeather2(abortController.signal);
          setIsLoadedForecast(true);
          setCanRefresh(true);
        } catch (e) {
          console.log(e);
          const maxRetries = 3;
          if (attempt < maxRetries) {
            setTimeout(() => {
              console.log(`Retry attempt Weather 2: ${attempt}`);
              fetchAll(attempt + 1);
            }, 3000);
          }
          setIsLoadedForecast(false);
          setCanRefresh(true);
        }
      };
      fetchAll();
    }
    return () => {
      //setIsLoaded(false);
      //setIsLoadedForecast(false);
      setCanRefresh(false);
    };
  }, [isLocated, refreshFetch]);

  useEffect(() => {
    const getWeather3 = async (signal) => {
      const getUrlWeatherNextDay = `${weatherNextDay}?serviceKey=${serviceKey}&numOfRows=800&dataType=JSON&pageNo=1&base_date=${baseDateFuture}&base_time=${futureTime}&nx=${city[3]}&ny=${city[4]}`;
      try {
        const response = await fetch(getUrlWeatherNextDay, {
          signal: signal,
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();

        await jsonResponse.response.body.items.item.forEach((x, i) => {
          if (i === 0) {
            setHighestNextDays([]);
            setTempNextDays([]);
            setSkyNextDays([]);
            setAccuRain([]);
            setAccuSnow([]);
          }
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
          } else if (
            x.category === "PCP" &&
            (x.fcstDate === baseDate ||
              x.fcstDate === tomorrowDate ||
              x.fcstDate === afterTomorrowDate)
          ) {
            setAccuRain((prev) => [...prev, newData]);
          } else if (
            x.category === "SNO" &&
            (x.fcstDate === baseDate ||
              x.fcstDate === tomorrowDate ||
              x.fcstDate === afterTomorrowDate)
          ) {
            setAccuSnow((prev) => [...prev, newData]);
          }
        });
      } catch (error) {
        console.log(error);
        setIsLoaded(false);
        return Promise.reject(error);
      }
    };
    if (isLocated) {
      let fetchAll = async (attempt = 1) => {
        const abortController = new AbortController();
        console.log("try fetch Weather 3:", attempt);
        try {
          await getWeather3(abortController.signal);
          setIsForecasted(true);
          setCanRefresh(true);
        } catch (e) {
          console.log(e);
          const maxRetries = 3;
          if (attempt < maxRetries) {
            setTimeout(() => {
              console.log(`Retry attempt Weather 3: ${attempt}`);
              fetchAll(attempt + 1);
            }, 3000);
          }
          setIsForecasted(false);
          setCanRefresh(true);
        }
      };
      fetchAll();
    }
    return () => {
      //setIsForecasted(false);
      setCanRefresh(false);
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
    accuRain,
    setAccuRain,
    accuSnow,
    setAccuSnow,
    isLoaded,
    setIsLoaded,
    isLoadedForecast,
    setIsLoadedForecast,
    isForecasted,
    setIsForecasted,
    canRefersh,
    setCanRefresh,
  };
}
