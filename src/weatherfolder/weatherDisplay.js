import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../cssfolder/weather.module.css";
import WeatherPrediction from "./WeatherPrediction";
import WeatherCitySelector from "./WeatherCitySelector";

export default function WeatherDisplay(props) {
  const [imgSrc, setImgSrc] = useState(0);
  const {
    handlecityselector,
    cityselector,
    dataimport,
    displayinfo,
    raincond,
    humidity,
    hourrain,
    temp,
    winddir,
    windspeed,
    reset,
    refresh,
    loadstate,
    loadforecast,
    srcimage,
    displaycity,
    citydata,
    setcity,
    tempforecast,
    skyforecast,
    rainforecast,
    mouseenter,
    mouseleave,
  } = props;

  return (
    <div className={styles.weatherBigBox}>
      <div className={styles.buttonBox}>
        <button
          className={styles.buttonResetRefresh}
          onClick={reset}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Reset
        </button>
        <button
          className={styles.buttonResetRefresh}
          onClick={refresh}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Refresh
        </button>
        <button
          className={styles.buttonResetRefresh}
          onClick={displayinfo}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Command
        </button>
      </div>

      {!loadstate && <Skeleton count={1} className={styles.skeleton} />}
      {loadstate && loadforecast && (
        <div
          style={{
            background:
              raincond.value === "1"
                ? "linear-gradient(300deg,#c5e2f7 2%,#92bad2 20%,#53789E 70%)"
                : raincond.value === "3"
                ? "linear-gradient(105deg, #cce5ec, #fffafa 50%, #93e7fb 100%)"
                : skyforecast[0].value === "4"
                ? "linear-gradient(45deg, #d8d2cf, #d4e6ed 80%)"
                : skyforecast[0].value === "3"
                ? "linear-gradient(45deg, #d8d2cf, #d4e6ed 60%, #ffcc00 110%)"
                : skyforecast[0].value === "1"
                ? "linear-gradient(225deg, #ffcc00, #e5d075 30%, #f5e0b0 70%)"
                : "transparent",
          }}
          className={styles.weatherBox}
        >
          <div className={styles.weatherHeader}>
            <div className={styles.weatherHeaderSubdiv}>
              <p className={styles.weatherHeadText}>Weather</p>
              <p className={styles.smallText}>
                (Base time: {temp.time.slice(0, 2)}:30)
              </p>
            </div>
            <WeatherCitySelector
              dataimport={dataimport}
              cityselector={cityselector}
              handlecityselector={handlecityselector}
              mouseenter={mouseenter}
              mouseleave={mouseleave}
            />
            <label style={{ display: "none" }}>
              <select
                value={setcity[0]}
                onChange={displaycity}
                className={styles.cityselector}
              >
                {citydata.map((x, i) => (
                  <option value={i} label={x.city}></option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.imageAndRain}>
            <img
              className={styles.image}
              src={
                srcimage[
                  raincond.value === "1" ? 4 : `${skyforecast[0].value - 1}`
                ]
              }
            />
            <p>
              {raincond.value === "1"
                ? "Rain"
                : raincond.value === "3"
                ? "Snow"
                : skyforecast[0].value === "4"
                ? "Cloudy"
                : skyforecast[0].value === "3"
                ? "Partly cloudy"
                : skyforecast[0].value === "1"
                ? "Sunny"
                : "No information"}
            </p>
            <p className={styles.smallText}>
              {raincond.value === "1" ? `Rain hour: ${hourrain.value} mm` : ""}
            </p>
          </div>

          <div className={styles.actualWeatherBox}>
            <p className={styles.actualTemp}>{temp.value} degres</p>
            <p>
              {`${windspeed.value} m/s`}
              {windspeed.value < 9
                ? " (Weak)"
                : windspeed.value < 14
                ? " (Strong)"
                : " (Very strong)"}
            </p>
            <p>Humidity: {humidity.value}%</p>
          </div>
          <WeatherPrediction
            loadforecast={loadforecast}
            tempforecast={tempforecast}
            srcimage={srcimage}
            raincond={raincond}
            skyforecast={skyforecast}
            rainforecast={rainforecast}
          />
        </div>
      )}
    </div>
  );
}
