import styles from "../cssfolder/weather.module.css";

export default function WeatherPrediction(props) {
  const { srcimage, raincond, skyforecast, tempforecast, rainforecast } = props;

  return (
    <div className={styles.predictionBox1}>
      {raincond.value === "1" ? "" : "Prediction:"}
      <div className={styles.predictionBox2}>
        {tempforecast.slice(1, tempforecast.length).map((x, i) => (
          <ul className={styles.predictonByHour}>
            <img
              src={
                srcimage[
                  rainforecast[i + 1].value === "1"
                    ? 4
                    : rainforecast[i + 1].value === "5"
                    ? 4
                    : `${skyforecast[i + 1].value - 1}`
                ]
              }
              className={styles.predictionImage}
            ></img>
            <li className={styles.smallText}>{x.value}°</li>
            <li className={styles.smallText}>{x.time.slice(0, 2)}h</li>
          </ul>
        ))}
      </div>
    </div>
  );
}
