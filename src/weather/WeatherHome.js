import { useContext } from "react";
import WeatherCreateMyList from "./WeatherCreateMyList";
import WeatherLocalisation from "./WeatherLocalisation";
import { QueryContext } from "../GlobalBody";

export default function WeatherHome(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const {
    dataimport,
    activeTab,
    setActiveTab,
    menuOn,
    setMenuOn,
    menuListOn,
    setMenuListOn,
    lastSessionListe,
    setLastSessionListe,
    images,
    updateDates,
    serviceKey,
    baseDate,
    baseTime,
    baseTimeForecast,
  } = useContext(QueryContext);
  return (
    <div
      className="justify-aroun flex h-fit w-11/12 flex-row flex-wrap items-center  sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit"
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className="my-10 flex h-fit w-full flex-col items-start justify-center bg-green-700 px-20 py-10 text-white">
        <h1 className="my-4 self-center text-3xl">Welcome</h1>
        <p className="my">
          The current home display both the location and the list maker
        </p>
        <p>Use the side menu to:</p>
        <p>- Display the weather at your current location</p>
        <p>- Make a list of city and display their weather </p>
        <p className="my-2">Future update will improve the list creation</p>
      </div>
      <p className="my-2 rounded-2xl border border-solid border-red-400 p-2 text-2xl">
        Location
      </p>
      <WeatherLocalisation mouseenter={mouseenter} mouseleave={mouseleave} />
      <p className="my-2 rounded-2xl border border-solid border-red-400 p-2 text-2xl">
        List
      </p>
      <WeatherCreateMyList
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        resizew={resizew}
        closemenu={false}
      />
    </div>
  );
}
