import styles from "../cssfolder/weather.module.css";
import { useEffect, useState, useRef } from "react";
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

  const [temporary, setTemporary] = useState([]);
  const [temporary2, setTemporary2] = useState([]);
  const [isReady, setIsReady] = useState(null);

  const [weatherInfoNow, setWeatherInfoNow] = useState({});
  const [weatherForecast, setWeatherForecast] = useState({});
  const [skyForecast, setSkyForecast] = useState({});
  const [tempForecast, setTempForecast] = useState({});
  const [refreshData, setRefreshData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);

  const customFunctionRunRef = useRef(false);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

  const handleResetListe = (e) => {
    setListe([]);
    setDisplayWeatherList(false);
    setWeatherInfoNow({});
    setWeatherForecast({});
    setTempForecast({});
    setSkyForecast({});
    setTemporary([]);
    setTemporary2([]);
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
        setWeatherForecast({});
        setTempForecast({});
        setSkyForecast({});
        setTemporary([]);
        setTemporary2([]);
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

  const handleConfirmListe = () => {
    liste.forEach((e, i) => {
      setWeatherInfoNow((prev) => ({
        ...prev,
        [e.Phase3]: temporary.filter((x) => x.name === e.Phase3),
      }));
    });
    liste.forEach((e, i) => {
      setWeatherForecast((prev) => ({
        ...prev,
        [e.Phase3]: temporary2.filter(
          (x) => x.name === e.Phase3 && x.category === "PTY"
        ),
      }));
      setSkyForecast((prev) => ({
        ...prev,
        [e.Phase3]: temporary2.filter(
          (x) => x.name === e.Phase3 && x.category === "SKY"
        ),
      }));
      setTempForecast((prev) => ({
        ...prev,
        [e.Phase3]: temporary2.filter(
          (x) => x.name === e.Phase3 && x.category === "T1H"
        ),
      }));
    });
  };

  const handleCommand = () => {
    window.console.log("MAP");
    window.console.log(temporary);
    window.console.log(weatherInfoNow);
    window.console.log("MAP2");
    window.console.log(temporary2);
    window.console.log(weatherForecast);
    window.console.log(skyForecast);
    window.console.log(tempForecast);
  };

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        const urlWeatherList = `${weatherUrlNow}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetimeforecast}&nx=${nx}&ny=${ny}`;
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
          jsonResponse.response.body.items.item.forEach((x) => {
            setTemporary((prev) => [
              ...prev,
              {
                name: name,
                category: x.category,
                value: x.obsrValue,
                time: x.baseTime,
                nx: x.nx,
                ny: x.ny,
              },
            ]);
          });
          //return setIsReady(true);
        } catch (error) {
          console.log(error);
          setIsLoaded(false);
        }
      };
      liste.map(async (e, i) => {
        setWeatherInfoNow((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        await getWeatherList(e.Phase3, e.nx, e.ny);
      });
      setIsLoaded(true);
    }
    return () => {
      //setIsReady(null);
      //customFunctionRunRef.current = false;
      setTemporary([]);
      setIsLoaded(false);
    };
  }, [refreshData]);

  /*useEffect(() => {
    if (isReady !== null && !customFunctionRunRef.current) {
      customFunctionRunRef.current = true;
      liste.forEach((e, i) => {
        setWeatherInfoNow((prev) => ({
          ...prev,
          [e.Phase3]: temporary.slice(i * 8, i * 8 + 8),
        }));
      });
    }
  }, [isReady]);*/

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        const urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherForecast, {});
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `List Predi ${name}`,
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          jsonResponse.response.body.items.item.forEach((x) => {
            let newData = {
              name: name,
              category: x.category,
              time: x.fcstTime,
              value: x.fcstValue,
              basetime: x.baseTime,
              nx: x.nx,
              ny: x.ny,
            };
            if (x.category === "PTY") {
              setTemporary2((prev) => [...prev, newData]);
            } else if (x.category === "T1H") {
              setTemporary2((prev) => [...prev, newData]);
            } else if (x.category === "SKY") {
              setTemporary2((prev) => [...prev, newData]);
            }
          });
        } catch (error) {
          console.log(error);
          setIsLoadedForecast(false);
        }
      };
      liste.map(async (e, i) => {
        setWeatherForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        setTempForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        setSkyForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        await getWeatherList(e.Phase3, e.nx, e.ny);
      });
      setIsLoadedForecast(true);
    }
    return () => {
      setTemporary2([]);
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
        onClick={handleConfirmListe}
      >
        Confirm
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
