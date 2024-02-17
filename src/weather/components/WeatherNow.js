import { useState, useContext, useEffect } from "react";
import { QueryContext } from "../../layout/RootLayout";
import { IoPlaySkipForwardOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { animated } from "react-spring";

export default function WeatherNow(props) {
  const {
    raincond,
    humidity,
    hourrain,
    temp,
    windspeed,
    skyforecast,
    springanimation,
  } = props;

  const { images, isDarkTheme } = useContext(QueryContext);

  function skyNow() {
    const x =
      raincond.value === "1" || raincond.value === "5" || raincond.value === "6"
        ? { image: images[4], text: "Rainy" }
        : raincond.value === "2" || raincond.value === "3"
          ? { image: images[5], text: "Snowy" }
          : skyforecast[0].value === "4"
            ? { image: images[3], text: "Cloudy" }
            : skyforecast[0].value === "3"
              ? { image: images[2], text: "Partially cloud" }
              : skyforecast[0].time.slice(0, 2) > 22 ||
                  skyforecast[0].time.slice(0, 2) < 7
                ? { image: images[6], text: "Clear night" }
                : { image: images[skyforecast[0].value - 1], text: "Sunny" };
    return x;
  }

  const displaySky = skyNow();

  return (
    <animated.div
      style={springanimation ? { ...springanimation } : {}}
      className={`flex h-fit select-none flex-wrap content-start justify-around rounded-2xl bg-transparent sm:w-full md:w-full lg:w-full `}
    >
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
          className="tooltip_element h-28 w-28"
          data-tooltip-id="image-tooltip"
          data-tooltip-content={displaySky.text}
          data-data-tooltip-place="top"
          src={displaySky.image}
        />
        <p>{displaySky.text}</p>
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
      <Tooltip id="image-tooltip" />
    </animated.div>
  );
}
