import { useContext } from "react";
import { QueryContext } from "../App";

export default function WeatherPrediction(props) {
  const { raincond, skyforecast, tempforecast, rainforecast } = props;
  const { images } = useContext(QueryContext);
  return (
    <div className="border-1 m-2 mt-1 w-full rounded-2xl border-solid border-transparent bg-white bg-opacity-25 p-2">
      Prediction:
      <div className="flex w-full flex-row flex-nowrap justify-between">
        {tempforecast.slice(1, 6).map((x, i) => (
          <ul
            className="m-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
            key={`ulNo${i}`}
          >
            <li className="mb-1 text-base" key={`li2no${i}`}>
              {x.time.slice(0, 2)}h
            </li>
            <img
              src={
                images[
                  rainforecast[i + 1].value === "1"
                    ? 4
                    : rainforecast[i + 1].value === "2"
                      ? 5
                      : rainforecast[i + 1].value === "3"
                        ? 5
                        : rainforecast[i + 1].value === "5"
                          ? 4
                          : `${skyforecast[i + 1].value - 1}`
                ]
              }
              className="h-7 w-auto"
              key={`image${x.value}${i}`}
            ></img>
            <li className="text-xl" key={`li1no${i}`}>
              {x.value}°
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
