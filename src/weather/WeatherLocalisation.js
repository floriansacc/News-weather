import { useState, useEffect } from "react";
import WeatherUID from "./WeatherUID";

export default function WeatherLocalisation(props) {
  const {
    dataimport,
    mouseenter,
    mouseleave,
    basetime,
    basetimeforecast,
    servicekey,
    srcimage,
    updatedate,
    basedate,
    activetab,
  } = props;

  const [gps, setGps] = useState({ lat: 0, long: 0 });
  const [weatherInfoNow, setWeatherInfoNow] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [skyForecast, setSkyForecast] = useState([]);
  const [tempForecast, setTempForecast] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [citySelector, setCitySelector] = useState([
    "선택",
    "",
    "",
    null,
    null,
  ]);
  const [refreshData, setRefreshData] = useState(0);
  const [refreshData2, setRefreshData2] = useState(0);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

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
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setRefreshData2((prev) => prev + 1);
    }
  };

  const handleDisplayInfo = () => {
    window.console.log(weatherInfoNow);
    window.console.log(weatherForecast);
    window.console.log(tempForecast);
    window.console.log(skyForecast);
    window.console.log(citySelector);
    window.console.log(basedate);
    window.console.log(basetime);
    window.console.log(basetimeforecast);
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
    updatedate();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(succesLocation, errorLocation);
    return () => {
      setIsLocated(false);
      setCitySelector(["없음", "없음", "없음", null, null]);
    };
  }, [refreshData]);

  useEffect(() => {
    const getUrlWeatherNow = `${weatherUrlNow}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${citySelector[3]}&ny=${citySelector[4]}`;
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
              Phase1: citySelector[0],
              Phase2: citySelector[1],
              Phase3: citySelector[2],
            },
          ]);
        });
        setIsLoaded(true);
      } catch (error) {
        window.console.log(error);
        setIsLoaded(false);
      }
    };
    if (isLocated) {
      getWeather();
    }
    return () => {
      setIsLoaded(false);
    };
  }, [isLocated, refreshData2]);

  useEffect(() => {
    const getUrlWeatherForecast = `${weatherUrlForecast}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetimeforecast}&nx=${citySelector[3]}&ny=${citySelector[4]}`;
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
        await jsonResponse.response.body.items.item.forEach((x) => {
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
        });
        setIsLoadedForecast(true);
      } catch (error) {
        window.console.log(error);
        setIsLoadedForecast(false);
      }
    };
    if (isLocated) {
      getWeather2();
    }
    return () => {
      setIsLoadedForecast(false);
    };
  }, [isLocated, refreshData2]);

  return (
    <div
      href="#location"
      className={`${
        activetab === 2
          ? "hidden sm:mb-20"
          : activetab === 1
            ? "flex"
            : "flex sm:mb-20"
      } m-0 h-full w-fit flex-row justify-center sm:w-full md:mb-20 md:w-full`}
    >
      <div className="right-0 top-1 hidden">
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
        dataimport={dataimport}
        displayinfo={handleDisplayInfo}
        srcimage={srcimage}
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
        activetab={activetab}
        islocated={isLocated}
      />
    </div>
  );
}
