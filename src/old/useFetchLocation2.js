import { useState, useEffect, useContext } from "react";
import { QueryContext } from "../App";

export default function useFetchLocation2(isLocated, refreshFetch) {
  const {
    baseDate,
    baseDateFuture,
    tomorrowDate,
    afterTomorrowDate,
    baseTime,
    baseTimeForecast,
    futureTime,
  } = useContext(QueryContext);

  const [oui, setOui] = useState(false);

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  const weatherUrlNow =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

  useEffect(() => {
    const abortController = new AbortController();
    const getWeather = async () => {
      const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=92&ny=113`;
      try {
        const response = await fetch(getUrlWeatherNow, {
          signal: abortController.signal,
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Pas de météo pour toi");
        }
        const jsonResponse = await response.json();
        window.console.log([
          `Geolocation`,
          jsonResponse.response.header["resultMsg"],
        ]);
      } catch (e) {}
    };
    getWeather();
  }, [isLocated, refreshFetch]);

  return { oui, setOui };
}
