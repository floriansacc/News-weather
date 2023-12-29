import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WeatherPrediction from "./WeatherPrediction";
import WeatherCitySelector from "./WeatherCitySelector";
import { QueryContext } from "../App";
import WeatherLongTerm from "./WeatherLongTerm";

export default function WeatherUID(props) {
  const {
    handlecityselector,
    cityselector,
    displayinfo,
    raincond,
    humidity,
    hourrain,
    temp,
    winddir,
    windspeed,
    refresh,
    loadstate,
    loadforecast,
    tempforecast,
    skyforecast,
    rainforecast,
    mouseenter,
    mouseleave,
    showbutton,
    titlename,
    islocated,
    forlist,
    resizew,
    tempnextday,
    temptwoday,
    isforecasted,
  } = props;
  const { dataimport, images, activeTab } = useContext(QueryContext);

  const [previousBg, setPreviousBg] = useState(null);
  let bgSet;

  const bgFunction = () => {
    if (!raincond || !skyforecast || !loadstate || !loadforecast) {
      if (previousBg) {
        bgSet = previousBg;
        return bgSet;
      }
      bgSet = "bg-yellow-100";
      return bgSet;
    } else {
      bgSet =
        raincond.value === "1"
          ? "bg-perso1"
          : raincond.value === "3"
            ? "bg-perso2"
            : skyforecast[0].value === "4"
              ? "bg-perso3"
              : skyforecast[0].value === "3"
                ? "bg-perso4"
                : skyforecast[0].value === "1"
                  ? "bg-perso5"
                  : "bg-red-100";
      return bgSet;
    }
  };

  const backgroundColoring = bgFunction();

  useEffect(() => {
    setPreviousBg(bgSet);
  }, [refresh]);

  return (
    <div
      className={`z-20 flex h-full select-none flex-col ${backgroundColoring} flex-nowrap duration-500 md:w-full lg:w-full lg:rounded-2xl ${
        showbutton ? "sm:w-full" : "sm:w-full sm:max-w-none"
      }`}
    >
      <div
        className={`m-1 mb-4 flex flex-col items-end justify-end ${
          showbutton ? "block" : "hidden"
        }`}
      >
        <button
          className="m-1.5 flex h-8 w-fit items-center rounded-full border-2 border-solid border-gray-400 bg-gradient-to-r from-gray-300/25 to-gray-700/25 p-1.5"
          onClick={refresh}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Refresh location
        </button>
        <p>located: {islocated ? "yes" : "no"}</p>
        <button
          className="m-1.5 hidden h-8 w-fit items-center rounded-full border-2 border-solid border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5"
          onClick={displayinfo}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Console
        </button>
      </div>
      {loadstate && loadforecast && (
        <div className="flex h-full flex-wrap content-start justify-around rounded-2xl bg-transparent sm:w-screen md:w-screen lg:w-full">
          <div
            className={`${
              showbutton ? "" : "py-5"
            } my-2 flex h-fit w-full items-center justify-around rounded-2xl border-y border-solid border-white`}
          >
            <div className="flex flex-col flex-nowrap justify-start">
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
          {(cityselector || titlename) && (
            <div className="flex w-full flex-nowrap items-center justify-center whitespace-nowrap py-4 text-right ">
              <p className="w-fit p-px pb-1 text-xl font-semibold">
                {raincond.Phase1}
              </p>
              <p className="p-px">{` - ${raincond.Phase2} -`}</p>
              <p className="p-px">{raincond.Phase3}</p>
            </div>
          )}
          <div className="mt-2 flex w-5/12 flex-col items-center">
            <img
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
              {`${windspeed.value} m/s`}
              {windspeed.value < 9
                ? " (Weak)"
                : windspeed.value < 14
                  ? " (Strong)"
                  : " (Very strong)"}
            </p>
            <p>Humidity: {humidity.value}%</p>
          </div>

          <WeatherPrediction
            loadforecast={loadforecast}
            tempforecast={tempforecast}
            raincond={raincond}
            skyforecast={skyforecast}
            rainforecast={rainforecast}
          />
          <WeatherLongTerm
            tempnextday={tempnextday}
            temptwoday={temptwoday}
            isforecasted={isforecasted}
          />
        </div>
      )}
    </div>
  );
}
