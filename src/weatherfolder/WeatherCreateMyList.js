import styles from "../cssfolder/weather.module.css";
import { useEffect, useState } from "react";
import WeatherDisplay from "./WeatherDisplay";

export default function WeatherCreateMyList(props) {
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
  } = props;
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);
  const [displayWeatherList, setDisplayWeatherList] = useState(false);

  const [weatherInfoNow, setWeatherInfoNow] = useState({});
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [skyForecast, setSkyForecast] = useState([]);
  const [tempForecast, setTempForecast] = useState([]);
  const [refreshData, setRefreshData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

  const handleResetListe = (e) => {
    setListe([]);
    setDisplayWeatherList(false);
    setWeatherInfoNow({});
    setWeatherForecast([]);
    setTempForecast([]);
    setSkyForecast([]);
    setIsLoaded(false);
    setIsLoadedForecast(false);
  };

  const handleFillListe = () => {
    if (liste.some((e) => e.Phase3 === elem[2]) || !elem[2]) {
      return false;
    } else {
      setListe((prev) => [
        ...prev,
        {
          Phase1: elem[0],
          Phase2: elem[1],
          Phase3: elem[2],
          nx: elem[3],
          ny: elem[4],
        },
      ]);
      setElem(["선택"]);
    }
  };

  const handleCitySelector = (e) => {
    if (e.target.name === "one") {
      setElem(["선택"]);
      setElem([e.target.value]);
    } else if (e.target.name === "two") {
      setElem([elem[0], e.target.value]);
    } else if (e.target.name === "three") {
      let [coord] = Array.from(
        new Set(
          dataimport
            .filter((word) => word.Part3 === e.target.value)
            .map((x) => [x.nx, x.ny])
        )
      );
      setElem([elem[0], elem[1], e.target.value, coord[0], coord[1]]);
    }
  };

  const handleWeatherListeDisplay = (e) => {
    if (!liste[0]) {
      return;
    } else {
      if (displayWeatherList) {
        e.preventDefault();
        e.target.style.background = "";
        setDisplayWeatherList(false);
        setWeatherInfoNow({});
        setWeatherForecast([]);
        setTempForecast([]);
        setSkyForecast([]);
        setIsLoaded(false);
        setIsLoadedForecast(false);
      } else {
        e.preventDefault();
        e.target.style.background = "red";
        setDisplayWeatherList(true);
        setRefreshData((prev) => prev + 1);
      }
    }
  };

  const handleCommand = () => {
    window.console.log(weatherInfoNow);
    window.console.log(weatherForecast);
    window.console.log(tempForecast);
    window.console.log(skyForecast);
  };

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async () => {
        liste.forEach(async (e, i) => {
          const urlWeatherList = `${weatherUrlNow}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetimeforecast}&nx=${e.nx}&ny=${e.ny}`;
          try {
            const response = await fetch(urlWeatherList, {});
            if (!response.ok) {
              throw new Error("Pas de météo pour toi");
            }
            const jsonResponse = await response.json();
            window.console.log([
              "LIST",
              jsonResponse.response.header["resultMsg"],
              jsonResponse.response.body.items.item,
            ]);
            await jsonResponse.response.body.items.item.forEach((x) => {
              let newData = [
                {
                  category: x.category,
                  value: x.obsrValue,
                  time: x.baseTime,
                },
              ];
              //setWeatherInfoNow((prev) => [...prev, ...newData]);
              setWeatherInfoNow((prev) => ({
                ...prev,
                [weatherInfoNow.i]: [{ ...newData }],
              }));
            });
          } catch (error) {
            console.log(error);
            setIsLoaded(false);
          }
        });
      };
      getWeatherList();
      setIsLoaded(true);
    }
    return () => {
      setIsLoaded(false);
    };
  }, [refreshData]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeather2List = async () => {
        liste.forEach(async (e, index) => {
          const urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${e.nx}&ny=${e.ny}`;
          try {
            const response = await fetch(urlWeatherForecast, {});
            if (!response.ok) {
              throw new Error("Pas de météo pour toi");
            }
            const jsonResponse = await response.json();
            window.console.log([
              `List Predi ${e.Phase3}`,
              jsonResponse.response.header["resultMsg"],
              jsonResponse.response.body.items.item,
            ]);
            await jsonResponse.response.body.items.item.forEach((x) => {
              let newData = [
                {
                  category: x.category,
                  time: x.fcstTime,
                  value: x.fcstValue,
                  basetime: x.baseTime,
                  nx: x.nx,
                  ny: x.ny,
                },
              ];
              if (x.category === "PTY") {
                setWeatherForecast((prev) => [...prev, ...newData]);
              } else if (x.category === "T1H") {
                setTempForecast((prev) => [...prev, ...newData]);
              } else if (x.category === "SKY") {
                setSkyForecast((prev) => [...prev, ...newData]);
              }
            });
          } catch (error) {
            console.log(error);
            setIsLoadedForecast(false);
          }
        });
      };
      setIsLoadedForecast(true);
      getWeather2List();
    }
    return () => {
      setIsLoadedForecast(false);
    };
  }, [refreshData]);

  /**
    {displayWeatherList && (
        <WeatherDisplay
          dataimport={dataimport}
          srcimage={srcimage}
          loadstate={isLoaded}
          loadforecast={isLoadedForecast}
          raincond={weatherInfoNow[0]}
          humidity={weatherInfoNow[1]}
          hourrain={weatherInfoNow[2]}
          temp={weatherInfoNow[3]}
          winddir={weatherInfoNow[5]}
          windspeed={weatherInfoNow[7]}
          tempforecast={tempForecast}
          skyforecast={skyForecast}
          rainforecast={weatherForecast[0]}
          showbutton={false}
        />
      )}
   */

  return (
    <div className={styles.listBigBox}>
      <div className={styles.listeSelectionBox}>
        <div className={styles.listButtonBox}>
          <button
            className={styles.buttonResetRefresh}
            onClick={handleResetListe}
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
          >
            Reset
          </button>
          <button
            className={styles.buttonResetRefresh}
            onClick={handleFillListe}
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
          >
            Add to my list
          </button>
        </div>
        <div>
          <label className={styles.cityContainer}>
            <select
              className={styles.citySelector}
              name="one"
              value={elem[0]}
              onChange={handleCitySelector}
            >
              <option name="one" value="선택" label="선택"></option>
              {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map(
                (x) => {
                  return <option name="one" value={x} label={x}></option>;
                }
              )}
            </select>
            <select
              className={styles.citySelector}
              name="two"
              value={elem[1]}
              onChange={handleCitySelector}
            >
              {Array.from(
                new Set(
                  dataimport
                    .filter((word) => word.Part1 === elem[0])
                    .map((obj) => obj.Part2)
                )
              ).map((x) => {
                return <option name="two" value={x} label={x}></option>;
              })}
            </select>
            <select
              className={styles.citySelector}
              name="three"
              value={elem[2]}
              onChange={handleCitySelector}
            >
              {Array.from(
                new Set(
                  dataimport
                    .filter((word) => word.Part2 === elem[1])
                    .map((obj) => obj)
                )
              ).map((x) => {
                return (
                  <option name="three" value={x.Part3} label={x.Part3}></option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      {liste[0] && <p style={{ margin: "1rem 0" }}>List of city to display:</p>}
      <div
        style={{ display: liste[0] ? "grid" : "none" }}
        className={styles.listBox}
      >
        {liste[0] && (
          <>
            <p className={styles.listGridTitle}>1단계</p>
            <p className={styles.listGridTitle}>2단계</p>
            <p className={styles.listGridTitle}>3단계</p>
          </>
        )}
        {liste.map((x, i) => (
          <>
            <p className={styles.listStyle}>{x.Phase1}</p>
            <p className={styles.listStyle}>{x.Phase2}</p>
            <p className={styles.listStyleLast}>{x.Phase3}</p>
          </>
        ))}
      </div>
      <button
        className={styles.buttonResetRefresh}
        onMouseEnter={mouseenter}
        onMouseLeave={mouseleave}
        onClick={handleWeatherListeDisplay}
      >
        Display
      </button>
      <button
        className={styles.buttonResetRefresh}
        onMouseEnter={mouseenter}
        onMouseLeave={mouseleave}
        onClick={handleCommand}
      >
        Command
      </button>
    </div>
  );
}
