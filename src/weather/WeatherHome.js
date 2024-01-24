import { useContext } from "react";
import WeatherLocalisation from "./WeatherLocalisation";
import WeatherCreateMyList from "./WeatherCreateMyList";
import { QueryContext } from "../App";
import useFetchRadar from "../fetch/useFetchRadar";
import WeatherRadar from "./components/WeatherRadar";

export default function WeatherHome(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const { menuOn, setMenuOn } = useContext(QueryContext);

  const { radar, setRadar, isRadarOk, setIsRadarOk } = useFetchRadar();

  /*
  {isRadarOk && radar && (
          <div>
            <WeatherRadar
              radar={radar}
              setradar={setRadar}
              isradarok={isRadarOk}
              setisradarok={setIsRadarOk}
            />
          </div>
        )} 
        */

  return (
    <div
      className="flex h-fit w-full flex-col flex-wrap items-start justify-around overflow-hidden sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit"
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className=" my-10 flex h-fit w-fit flex-col items-center justify-center bg-green-900 px-10 py-10 text-white sm:w-full md:w-full">
        <h1 className="my-4 self-center text-3xl">Welcome</h1>
        <p className="my">
          The current home display both the location and the list maker
        </p>
        <br />
        <p>Use the side menu to:</p>
        <p>- Display the weather at your current location</p>
        <p>- Make a list of city and display their weather </p>
        <p className="my-2">Future update will improve the list creation</p>
      </div>
      <div className="flex w-full flex-col items-center justify-around lg:flex-row">
        <div className="flex w-[90%] flex-col lg:w-[40%]">
          <p className=" my-2 self-center rounded-2xl border border-solid border-red-400 p-2 text-2xl">
            Location
          </p>
          <WeatherLocalisation
            mouseenter={mouseenter}
            mouseleave={mouseleave}
          />
        </div>
      </div>
    </div>
  );
}
