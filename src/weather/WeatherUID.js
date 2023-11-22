import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WeatherPrediction from "./WeatherPrediction";
import WeatherCitySelector from "./WeatherCitySelector";

export default function WeatherUID(props) {
  const {
    handlecityselector,
    cityselector,
    dataimport,
    displayinfo,
    raincond,
    humidity,
    hourrain,
    temp,
    winddir,
    windspeed,
    reset,
    refresh,
    loadstate,
    loadforecast,
    srcimage,
    tempforecast,
    skyforecast,
    rainforecast,
    mouseenter,
    mouseleave,
    showbutton,
    titlename,
    activetab,
  } = props;

  return (
    <div
      className={`flex flex-col flex-nowrap h-fit sm:w-11/12 md:w-96 lg:w-96 sm:max-w-md ${
        showbutton ? "" : "sm:max-w-none sm:w-full"
      }`}
    >
      <div className={`flex m-1 ${showbutton ? "block" : "hidden"}`}>
        <button
          className="flex items-center m-1.5 p-1.5 h-8 border-2 border-solid border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
          onClick={reset}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Reset
        </button>
        <button
          className="flex items-center m-1.5 p-1.5 h-8 border-2 border-solid border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
          onClick={refresh}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Refresh
        </button>
        <button
          className="flex items-center m-1.5 p-1.5 h-8 border-2 border-solid border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
          onClick={displayinfo}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
        >
          Console
        </button>
      </div>

      {!loadstate && showbutton && (
        <Skeleton borderRadius="16px" count={1} className="w-full h-96" />
      )}
      {loadstate && loadforecast && (
        <div
          style={{
            background:
              raincond.value === "1"
                ? "linear-gradient(300deg,#c5e2f7 2%,#92bad2 20%,#53789E 70%)"
                : raincond.value === "3"
                ? "linear-gradient(105deg, #cce5ec, #fffafa 50%, #93e7fb 100%)"
                : skyforecast[0].value === "4"
                ? "linear-gradient(45deg, #d8d2cf, #d4e6ed 80%)"
                : skyforecast[0].value === "3"
                ? "linear-gradient(45deg, #d8d2cf, #d4e6ed 60%, #ffcc00 110%)"
                : skyforecast[0].value === "1"
                ? "linear-gradient(225deg, #ffcc00, #e5d075 30%, #f5e0b0 70%)"
                : "transparent",
          }}
          className="flex justify-around content-start flex-wrap w-full h-fit rounded-2xl"
        >
          <div className="flex justify-around items-center w-full h-24 border-b border-solid border-white rounded-2xl">
            <div className="flex flex-col flex-nowrap justify-start">
              <p className="block">Weather</p>
              <p className="text-sm">(Base time: {temp.time.slice(0, 2)}:30)</p>
            </div>
            {titlename && (
              <div className="flex flex-col flex-nowrap items-end text-right w-fit whitespace-nowrap ">
                <p className="font-semibold w-fit text-xl p-px pb-1 mb-1 border-b border-solid border-b-white">
                  {rainforecast[0].phase1}
                </p>
                <p className="p-px">{rainforecast[0].phase2}</p>
                <p className="p-px">{rainforecast[0].phase3}</p>
              </div>
            )}
            {showbutton && (
              <WeatherCitySelector
                dataimport={dataimport}
                cityselector={cityselector}
                handlecityselector={handlecityselector}
                mouseenter={mouseenter}
                mouseleave={mouseleave}
              />
            )}
          </div>

          <div className="flex flex-col items-center mt-2 w-5/12">
            <img
              className="w-20 h-20"
              src={
                srcimage[
                  raincond.value === "1" ? 4 : `${skyforecast[0].value - 1}`
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

          <div className="flex flex-col justify-end mb-2">
            <p className="font-semibold text-2xl mx-4">{temp.value} °C</p>
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
            srcimage={srcimage}
            raincond={raincond}
            skyforecast={skyforecast}
            rainforecast={rainforecast}
          />
        </div>
      )}
    </div>
  );
}
