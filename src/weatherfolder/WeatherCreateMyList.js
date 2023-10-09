import styles from "../cssfolder/weather.module.css";
import { useState } from "react";
import WeatherDisplay from "./WeatherDisplay";

export default function WeatherCreateMyList(props) {
  const { dataimport, mouseenter, mouseleave } = props;
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);
  const [displayWeatherList, setDisplayWeatherList] = useState(false);

  const handleResetListe = () => {
    setListe([]);
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
    displayWeatherList
      ? setDisplayWeatherList(false)
      : setDisplayWeatherList(true);
  };

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
      {displayWeatherList && <WeatherDisplay />}
    </div>
  );
}
