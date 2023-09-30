import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../cssfolder/weather.module.css";
import WeatherPrediction from "./WeatherPrediction";

export default function WeatherDisplay(props) {
  const [imgSrc, setImgSrc] = useState(0);
  const {
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
    sky,
    srcimage,
    displaycity,
    city,
    tempforecast,
    skyforecast,
  } = props;

  return (
    <div className={styles.weatherBigBox}>
      <div className={styles.buttonBox}>
        <button className={styles.buttonResetRefresh} onClick={reset}>
          Reset
        </button>
        <button className={styles.buttonResetRefresh} onClick={refresh}>
          Refresh
        </button>
      </div>
      {!loadstate && <Skeleton count={1} className={styles.skeleton} />}
      {loadstate && loadforecast && (
        <div className={styles.weatherBox}>
          <div className={styles.weatherHeader}>
            <div className={styles.weatherHeaderSubdiv}>
              <p className={styles.weatherHeadText}>Weather</p>
              <p className={styles.smallText}>
                (Base time: {temp.time.slice(0, 2)}:30)
              </p>
            </div>
            <label>
              <select value="" onChange={displaycity}>
                <option value="Jeonju" label="Jeonju" />
              </select>
            </label>
          </div>

          <div className={styles.imageAndRain}>
            <img
              className={styles.image}
              src={
                srcimage[
                  raincond.value === 1 ? 4 : `${skyforecast[0].value - 1}`
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
            <p>
              {raincond.value === "1"
                ? `Amount of rain this hour: ${hourrain.value} mm`
                : ""}
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
          />
        </div>
      )}
    </div>
  );
}
