import { useContext } from "react";
import { QueryContext } from "../App";
import WeatherCitySelector from "./WeatherCitySelector";

export default function WeatherNow(props) {
  const {
    handlecityselector,
    cityselector,
    raincond,
    humidity,
    hourrain,
    temp,
    windspeed,
    skyforecast,
    mouseenter,
    mouseleave,
    showbutton,
  } = props;
  const { images } = useContext(QueryContext);
  return (
    <div className="flex h-full select-none flex-wrap content-start justify-around rounded-2xl bg-transparent sm:w-full md:w-full lg:w-full">
      <div
        className={`${
          showbutton ? "" : "py-5"
        } my-2 flex h-fit w-full items-center justify-around rounded-2xl border-y border-solid border-white`}
      >
        <div className="ml-2 flex flex-col flex-nowrap justify-start">
          <p className="block text-xl font-bold">Weather</p>
          <p className="text-sm">(Base time: {temp.time.slice(0, 2)}:30)</p>
        </div>
        {showbutton && (
          <WeatherCitySelector
            cityselector={cityselector}
            handlecityselector={handlecityselector}
            mouseenter={mouseenter}
            mouseleave={mouseleave}
          />
        )}
      </div>
      <div className="flex w-full flex-nowrap items-center justify-center whitespace-nowrap py-4 text-right ">
        <p className="w-fit p-px pb-1 text-xl font-semibold">
          {raincond.Phase1}
        </p>
        <p className="p-px">{` - ${raincond.Phase2} -`}</p>
        <p className="p-px">{raincond.Phase3}</p>
      </div>
      <div className="mt-2 flex w-5/12 flex-col items-center">
        <img
          alt="mainimg"
          className="h-28 w-28"
          src={
            images[
              raincond.value === "1"
                ? 4
                : raincond.value === "3"
                  ? 5
                  : `${skyforecast[0].value - 1}`
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
        <p className="text-sm">
          {raincond.value === "1" ? `Rain hour: ${hourrain.value} mm` : ""}
        </p>
      </div>

      <div className="mb-2 flex flex-col justify-center">
        <p className="mx-4 text-2xl font-semibold">{temp.value} °C</p>
        <p>
          습도: <span className="font-semibold">{humidity.value}%</span>
        </p>
        <p>
          {`${windspeed.value} m/s`}
          {windspeed.value < 9
            ? " (Weak)"
            : windspeed.value < 14
              ? " (Strong)"
              : " (Very strong)"}
        </p>
      </div>
    </div>
  );
}
