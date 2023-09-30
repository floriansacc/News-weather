import { useState } from "react";
import styles from "./cssfolder/global.module.css";
import NaverNews from "./newsfolder/NaverNews";
import WeatherNow from "./weatherfolder/WeatherNow";

export default function GlobalBody() {
  return (
    <div className={styles.global}>
      <NaverNews />
      <WeatherNow />
    </div>
  );
}
