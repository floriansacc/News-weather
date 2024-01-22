import { useState, useEffect, useContext } from "react";
import { QueryContext } from "../App";
import useFetchTestLocation from "../fetch/useFetchTestLocation";
import WeatherNow from "./WeatherNow";
import WeatherLongTerm from "./WeatherLongTerm";
import WeatherPrediction24 from "./WeatherPrediction24";
import WeatherCitySelector from "./WeatherCitySelector";
import useFetchDust from "../fetch/useFetchDust";
import WeatherDust from "./WeatherDust";

export default function WeatherLocalisation(props) {
  const { mouseenter, mouseleave } = props;

  const {
    dataimport,
    activeTab,
    menuOn,
    setMenuOn,
    updateDates,
    toggleTheme,
    isDarkTheme,
    previousBg,
    setPreviousBg,
  } = useContext(QueryContext);

  const [gps, setGps] = useState({ lat: 0, long: 0 });
  const [isLocated, setIsLocated] = useState(false);
  const [citySelector, setCitySelector] = useState([
    "선택",
    "",
    "",
    null,
    null,
  ]);
  const [refreshGeoloc, setRefreshGeoloc] = useState(0);
  const [refreshFetch, setRefreshFetch] = useState(0);

  const {
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
  } = useFetchTestLocation(citySelector, isLocated, refreshFetch);

  const {
    pm10,
    setPm10,
    pm25,
    setPm25,
    globalIndex,
    setGlobalIndex,
    isDusted,
    setIsDusted,
  } = useFetchDust(citySelector, isLocated, refreshFetch);

  let bgSet;

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
    setRainNextDays([]);
    setAccuRain([]);
    setAccuSnow([]);
    setPm10({});
    setPm25({});
    setGlobalIndex({});
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setIsForecasted(false);
    setIsDusted(false);
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
      setRainNextDays([]);
      setAccuRain([]);
      setAccuSnow([]);
      setPm10({});
      setPm25({});
      setGlobalIndex({});
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setIsForecasted(false);
      setIsDusted(false);
      setRefreshFetch((prev) => prev + 1);
    }
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
    document.getElementById("refresh-button").innerHTML =
      "Unable to retrieve your location";
    setCanRefresh(true);
  };

  function bgFunction() {
    if (!weatherInfoNow[0] || !skyForecast || !isLoaded || !isLoadedForecast) {
      if (previousBg) {
        bgSet = previousBg;
        setPreviousBg(bgSet);
        return;
      }
      bgSet = "bg-yellow-100";
      setPreviousBg(bgSet);
      return;
    } else {
      bgSet =
        skyForecast[0].time.slice(0, 2) > 19 ||
        skyForecast[0].time.slice(0, 2) < 7
          ? "bg-perso6"
          : (weatherInfoNow[0].value === "1" ||
                weatherInfoNow[0].value === "5" ||
                weatherInfoNow[0].value === "6") &&
              !(
                skyForecast[0].time.slice(0, 2) > 19 ||
                skyForecast[0].time.slice(0, 2) < 7
              )
            ? "bg-perso1"
            : weatherInfoNow[0].value === "2" || weatherInfoNow[0].value === "3"
              ? "bg-perso2"
              : skyForecast[0].value === "4" &&
                  !(
                    skyForecast[0].time.slice(0, 2) > 19 ||
                    skyForecast[0].time.slice(0, 2) < 7
                  )
                ? "bg-perso3"
                : skyForecast[0].value === "3" &&
                    !(
                      skyForecast[0].time.slice(0, 2) > 19 ||
                      skyForecast[0].time.slice(0, 2) < 7
                    )
                  ? "bg-perso4"
                  : skyForecast[0].value === "1" &&
                      !(
                        skyForecast[0].time.slice(0, 2) > 19 ||
                        skyForecast[0].time.slice(0, 2) < 7
                      )
                    ? "bg-perso5"
                    : "bg-red-100";
      bgSet === ("bg-perso6" || "bg-perso1")
        ? toggleTheme("dark")
        : toggleTheme("light");
      setPreviousBg(bgSet);
      return;
    }
  }

  useEffect(() => {
    updateDates();
  }, [updateDates]);

  useEffect(() => {
    if (isLoaded && isLoadedForecast) {
      bgFunction();
    }
  }, [bgSet, isLoaded, isLoadedForecast]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(succesLocation, errorLocation);
    return () => {
      setIsLocated(false);
      setCitySelector([null, null, null, null, null]);
      document.getElementById("refresh-button").innerHTML = "Refresh Location";
    };
  }, [refreshGeoloc]);

  return (
    <div
      className={`${activeTab === 1 ? "" : "mb-20"} ${
        isDarkTheme ? "text-light" : "text-dark"
      } z-10 m-0 box-border flex h-full  w-fit min-w-full select-none flex-col flex-nowrap items-center justify-start overflow-hidden duration-500 sm:w-full md:w-full lg:h-fit lg:w-full lg:min-w-0 lg:rounded-2xl`}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className=" m-1 mb-2 flex items-end justify-end self-end">
        <button
          className={`m-1.5 mb-0 flex h-8 w-fit items-center rounded-full border border-solid border-white/50 p-1.5 ${
            canRefersh
              ? "pointer-events-auto bg-gradient-to-r from-gray-300/25 to-gray-700/25"
              : "pointer-events-none bg-gradient-to-r from-red-300/75 to-red-700/75"
          }`}
          onClick={handleRefresh}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
          id="refresh-button"
        >
          Refresh location
        </button>
      </div>
      <div
        className={` my-2 flex h-fit w-full items-center justify-around rounded-2xl border-y border-solid border-white`}
      >
        <div className="ml-2 flex flex-col flex-nowrap justify-start">
          <p className="block text-xl font-bold">Weather</p>
          <p className="text-sm">
            (Base time:{" "}
            {isLoaded ? `${weatherInfoNow[3].time.slice(0, 2)}:30` : "00:00"})
          </p>
        </div>

        <WeatherCitySelector
          cityselector={citySelector}
          handlecityselector={handleCitySelector}
          mouseenter={mouseenter}
          mouseleave={mouseleave}
        />
      </div>

      {isLoaded && isLoadedForecast && (
        <WeatherNow
          loadstate={isLoaded}
          loadforecast={isLoadedForecast}
          raincond={weatherInfoNow[0]}
          humidity={weatherInfoNow[1]}
          hourrain={weatherInfoNow[2]}
          temp={weatherInfoNow[3]}
          winddir={weatherInfoNow[5]}
          windspeed={weatherInfoNow[7]}
          skyforecast={skyForecast}
          titlename={false}
        />
      )}
      {isDusted && (
        <WeatherDust
          pm10={pm10}
          setpm10={setPm10}
          pm25={pm25}
          setpm25={setPm25}
          globalindex={globalIndex}
          setglobalindex={setGlobalIndex}
          isdusted={isDusted}
          setisdusted={setIsDusted}
        />
      )}
      {isLoadedForecast && isForecasted && (
        <>
          <div className="m-2 mb-0 w-full p-2 pb-6">
            <WeatherPrediction24
              highestnextdays={highestNextDays}
              tempnextdays={tempNextDays}
              skynextdays={skyNextDays}
              rainnextdays={rainNextDays}
            />
          </div>
          <WeatherLongTerm
            highestnextdays={highestNextDays}
            tempnextdays={tempNextDays}
            skynextdays={skyNextDays}
            rainnextdays={rainNextDays}
            isforecasted={isForecasted}
          />
        </>
      )}
    </div>
  );
}
