export default function WeatherPrediction(props) {
  const { srcimage, raincond, skyforecast, tempforecast, rainforecast } = props;

  return (
    <div className="w-11/12">
      {raincond.value === "1" ? "" : "Prediction:"}
      <div className="flex flex-row flex-nowrap justify-between w-full">
        {tempforecast.slice(1, 6).map((x, i) => (
          <ul
            className="flex flex-col flex-nowrap items-center w-3/12 m-3 rounded-xl list-none"
            key={`ulNo${i}`}
          >
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
              className="h-7 w-auto mb-1"
              key={`image${x.value}${i}`}
            ></img>
            <li className="text-base" key={`li1no${i}`}>
              {x.value}°
            </li>
            <li className="text-base" key={`li2no${i}`}>
              {x.time.slice(0, 2)}h
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
