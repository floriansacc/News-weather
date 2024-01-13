import { useContext } from "react";
import WeatherCreateMyList from "./WeatherCreateMyList";
import WeatherLocalisation from "./WeatherLocalisation";
import { QueryContext } from "../App";

/*
<div className=" my-10 hidden h-fit w-full flex-col items-start justify-center bg-green-700 px-20 py-10 text-white">
        <h1 className="my-4 self-center text-3xl">Welcome</h1>
        <p className="my">
          The current home display both the location and the list maker
        </p>
        <p>Use the side menu to:</p>
        <p>- Display the weather at your current location</p>
        <p>- Make a list of city and display their weather </p>
        <p className="my-2">Future update will improve the list creation</p>
      </div> */

export default function WeatherHome(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const { menuOn, setMenuOn } = useContext(QueryContext);
  return (
    <div
      className="flex h-fit w-full flex-col flex-wrap items-start justify-around overflow-hidden sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit"
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className="flex w-[40%] flex-col">
        <p className=" my-2 self-center rounded-2xl border border-solid border-red-400 p-2 text-2xl">
          Location
        </p>
        <WeatherLocalisation mouseenter={mouseenter} mouseleave={mouseleave} />
      </div>
    </div>
  );
}
