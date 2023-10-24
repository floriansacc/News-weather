import { useState } from "react";
import styles from "./css/global.module.css";
import WeatherHome from "./weather/WeatherHome";

export default function GlobalBody() {
  return (
    <div className={styles.global}>
      <WeatherHome />
    </div>
  );
}
