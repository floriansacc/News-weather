import { useState, useEffect, useContext } from "react";
import WeatherUID from "./WeatherUID";
import { QueryContext } from "../App";

export default function WeatherLocalisation(props) {
  const { mouseenter, mouseleave } = props;

  const {
    dataimport,
    activeTab,
    menuOn,
    setMenuOn,
    images,
    updateDates,
    serviceKey,
    baseDate,
    baseTime,
    baseTimeForecast,
    tomorrowDate,
    afterTomorrowDate,
    futureTime,
  } = useContext(QueryContext);

  const [gps, setGps] = useState({ lat: 0, long: 0 });

  const [weatherInfoNow, setWeatherInfoNow] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [skyForecast, setSkyForecast] = useState([]);
  const [tempForecast, setTempForecast] = useState([]);
  const [highestNextDays, setHighestNextDays] = useState([]);
  const [tempNextDays, setTempNextDays] = useState([]);
  const [skyNextDays, setSkyNextDays] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);
  const [isLocated, setIsLocated] = useState(false);

  const [isForecasted, setisForecasted] = useState([]);
  const [citySelector, setCitySelector] = useState([
    "선택",
    "",
    "",
    null,
    null,
  ]);
  const [refreshGeoloc, setRefreshGeoloc] = useState(0);
  const [refreshFetch, setRefreshFetch] = useState(0);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const weatherNextDay =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  const RE = 6371.00877; // Earth radius (km)
  const GRID = 5.0; // Grid interval (km)
  const SLAT1 = 30.0; // Projection latitude 1 (degree)
  const SLAT2 = 60.0; // Projection latitude 2 (degree)
  const OLON = 126.0; // Reference longitude (degree)
  const OLAT = 38.0; // Reference latitude (degree)
  const XO = 43; // Reference X coordinate (GRID)
  const YO = 136; // Reference Y coordinate (GRID)
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const positionConversion = (code, v1, v2) => {
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    // 소스출처 : http://www.kma.go.kr/weather/forecast/digital_forecast.jsp  내부에 있음
    // https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    const rs = {};
    if (code === "toXY") {
      rs.lat = v1;
      rs.lng = v2;
      let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      let theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs.x = v1;
      rs.y = v2;
      const xn = v1 - XO;
      const yn = ro - v2 + YO;
      let ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) {
        ra = -ra;
      }
      let alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      let theta;
      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) {
            theta = -theta;
          }
        } else {
          theta = Math.atan2(xn, yn);
        }
      }
      const alon = theta / sn + olon;
      rs.lat = alat * RADDEG;
      rs.lng = alon * RADDEG;
    }
    return rs;
  };

  const handleRefresh = (e) => {
    setWeatherInfoNow([]);
    setWeatherForecast([]);
    setTempForecast([]);
    setSkyForecast([]);
    setHighestNextDays([]);
    setTempNextDays([]);
    setSkyNextDays([]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setRefreshGeoloc((prev) => prev + 1);
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
            .map((x) => [x.nx, x.ny]),
        ),
      );
      setCitySelector([
        citySelector[0],
        citySelector[1],
        e.target.value,
        coord[0],
        coord[1],
      ]);
      setWeatherInfoNow([]);
      setWeatherForecast([]);
      setTempForecast([]);
      setSkyForecast([]);
      setHighestNextDays([]);
      setTempNextDays([]);
      setSkyNextDays([]);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setisForecasted(false);
      setRefreshFetch((prev) => prev + 1);
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
    window.console.log(baseTimeForecast);
  };

  const findclosest = (xValue, data, parameter) => {
    let closestObject = null;
    let minDistance = 0.1;
    data.forEach((entry) => {
      const param = entry[parameter];
      const distance = Math.abs(xValue - param);
      if (distance < minDistance) {
        minDistance = distance;
        closestObject = entry;
      }
    });
    return closestObject;
  };

  const succesLocation = (position) => {
    try {
      let temporary = positionConversion(
        "toXY",
        position.coords.latitude,
        position.coords.longitude,
      );
      setGps({
        lat: temporary.lat,
        long: temporary.lng,
        x: temporary.x,
        y: temporary.y,
      });
      let cityName = findclosest(
        temporary.lat,
        dataimport.filter(
          (word) => word.nx === temporary.x && word.ny === temporary.y,
        ),
        "latitude",
      );
      setCitySelector([
        cityName.Part1,
        cityName.Part2,
        cityName.Part3,
        temporary.x,
        temporary.y,
      ]);
      setIsLocated(true);
    } catch (e) {
      window.console.log(e);
    }
  };

  const errorLocation = () => {
    window.console.log("Unable to retrieve your location");
  };

  useEffect(() => {
    updateDates();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(succesLocation, errorLocation);
    return () => {
      setIsLocated(false);
      setCitySelector(["없음", "없음", "없음", null, null]);
    };
  }, [refreshGeoloc]);

  useEffect(() => {
    const getWeather = async () => {
      const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${citySelector[3]}&ny=${citySelector[4]}`;
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
          `Geolocation ${citySelector}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        await jsonResponse.response.body.items.item.forEach((x) => {
          setWeatherInfoNow((prev) => [
            ...prev,
            {
              ny: x.ny,
              Phase1: citySelector[0],
              Phase2: citySelector[1],
              Phase3: citySelector[2],
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
      const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${citySelector[3]}&ny=${citySelector[4]}`;
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
          `Geolocation Forecast ${citySelector}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        await jsonResponse.response.body.items.item.forEach((x) => {
          let newData = {
            Phase1: citySelector[0],
            Phase2: citySelector[1],
            Phase3: citySelector[2],
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
          window.console.log("Geolocation all fetched");
        })
        .catch((e) => {
          window.console.log(`Geolocation fetch error: ${e}`);
          setIsLoaded(false);
          setIsLoadedForecast(false);
        });
    }
    return () => {
      setIsLoaded(false);
      setIsLoadedForecast(false);
    };
  }, [isLocated, refreshFetch]);

  useEffect(() => {
    const getWeather3 = async () => {
      const getUrlWeatherNextDay = `${weatherNextDay}?serviceKey=${serviceKey}&numOfRows=800&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${futureTime}&nx=${citySelector[3]}&ny=${citySelector[4]}`;
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
          `Geolocation next day ${citySelector}`,
          jsonResponse.response.header["resultMsg"],
        ]);
        window.console.log(jsonResponse.response.body.items.item);
        await jsonResponse.response.body.items.item.forEach((x, i) => {
          let newData = {
            Phase1: citySelector[0],
            Phase2: citySelector[1],
            Phase3: citySelector[2],
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
            (x.category === "SKY" || x.category === "PTY") &&
            (x.fcstDate === tomorrowDate || x.fcstDate === afterTomorrowDate) &&
            (x.fcstTime === "0600" || x.fcstTime === "1500")
          ) {
            setSkyNextDays((prev) => [...prev, newData]);
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

  return (
    <div
      className={`${
        activeTab === 1 ? "" : "mb-20"
      } m-0 h-screen w-fit flex-row items-start justify-around bg-slate-100 sm:w-full md:w-full md:flex-wrap lg:w-[45%] `}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className="right-0 top-1 ">
        <button
          onClick={() => {
            window.console.log(tempNextDays);
            window.console.log(skyNextDays);
          }}
        >
          OUI
        </button>
        <h1>
          X {citySelector[3]}, Y {citySelector[4]}
        </h1>
        <h1>lat {gps.lat}</h1>
        <h1>long {gps.long}</h1>
        <h1>isLocated: {isLocated ? "true" : "false"}</h1>
      </div>
      <WeatherUID
        handlecityselector={handleCitySelector}
        cityselector={citySelector}
        displayinfo={handleDisplayInfo}
        loadstate={isLoaded}
        loadforecast={isLoadedForecast}
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
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        showbutton={true}
        titlename={false}
        islocated={isLocated}
        highestnextday={highestNextDays}
        tempnextdays={tempNextDays}
        skynextdays={skyNextDays}
        isforecasted={isForecasted}
      />
    </div>
  );
}
