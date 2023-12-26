import { useContext } from "react";
import { QueryContext } from "../GlobalBody";

export default function WeatherPrediction(props) {
  const { raincond, skyforecast, tempforecast, rainforecast } = props;
  const { images } = useContext(QueryContext);
  return (
    <div className="m-2 mt-10 w-full rounded-2xl border border-solid border-black p-2">
      {raincond.value === "1" ? "" : "Prediction:"}
      <div className="flex w-full flex-row flex-nowrap justify-between">
        {tempforecast.slice(1, 6).map((x, i) => (
          <ul
            className="m-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
            key={`ulNo${i}`}
          >
            <img
              src={
                images[
                  rainforecast[i + 1].value === "1"
                    ? 4
                    : rainforecast[i + 1].value === "5"
                      ? 4
                      : `${skyforecast[i + 1].value - 1}`
                ]
              }
              className="mb-1 h-7 w-auto"
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
