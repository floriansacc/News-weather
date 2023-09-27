import { useState } from "react";

import styles from "../cssfolder/weather.module.css";

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

      {loadstate && (
        <div className={styles.weatherBox}>
          <div className={styles.weatherHeader}>
            <p className={styles.weatherHeadText}>Weather</p>
            <label>
              <select value="" onChange={displaycity}>
                <option value="Jeonju" label="Jeonju" />
              </select>
            </label>
          </div>
          {loadforecast && (
            <div className={styles.imageAndRain}>
              <img
                className={styles.image}
                src={srcimage[raincond.value === 1 ? 4 : `${sky.value - 1}`]}
              />
              <p>
                {raincond.value === "1"
                  ? "Rain"
                  : raincond.value === "3"
                  ? "Snow"
                  : sky.value === "4"
                  ? "Cloudy"
                  : sky.value === "3"
                  ? "Partly cloudy"
                  : sky.value === "1"
                  ? "Sunny"
                  : "No information"}
              </p>
              <p>
                {raincond.value === "1"
                  ? `Amount of rain this hour: ${hourrain.value} mm`
                  : ""}
              </p>
            </div>
          )}
          <div>
            <p>{temp.value} degres</p>
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
        </div>
      )}
    </div>
  );
}