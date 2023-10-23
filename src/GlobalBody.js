import { useState } from "react";
import styles from "./cssfolder/global.module.css";
import WeatherHome from "./weatherfolder/WeatherHome";

export default function GlobalBody() {
  return (
    <div className={styles.global}>
      <WeatherHome />
    </div>
  );
}
