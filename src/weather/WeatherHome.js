import { useContext } from "react";
import WeatherLocalisation from "./WeatherLocalisation";
import WeatherCreateMyList from "./WeatherCreateMyList";
import { QueryContext } from "../App";
import useFetchRadar from "../fetch/useFetchRadar";
import WeatherRadar from "./components/WeatherRadar";
import useFetchPartRadar from "../fetch/useFetchPartRadar";

export default function WeatherHome(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const { menuOn, setMenuOn, isDarkTheme } = useContext(QueryContext);

  const { radarRain, setRadarRain, isRadarRain, setIsRadarRain } =
    useFetchRadar();

  const {
    radarDust10,
    setRadarDust10,
    radarDust25,
    setRadarDust25,
    isRadarDusted,
    setIsRadarDusted,
  } = useFetchPartRadar();

  /*
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

              <WeatherRadar2
                radar1={setRadarDust10}
                setradar1={setRadarDust10}
                isradarok={isRadarDusted}
                setisradarok={setIsRadarDusted}
              />
              <button
                className="h-10 w-10 bg-red-500"
                onClick={() => {
                  console.log(setRadarDust10);
                  console.log(radarDust25);
                }}
              ></button>

      */

  return (
    <div
      className={` ${
        isDarkTheme ? "text-light" : "text-dark"
      } flex h-fit w-full flex-col flex-wrap items-start justify-around overflow-hidden sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit`}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className="flex w-full flex-col items-start justify-around sm:items-center lg:flex-row">
        <div className="flex w-[93%] flex-col lg:w-[40%]">
          <p className=" my-2 self-center rounded-2xl border border-solid border-red-400 p-2 text-2xl">
            Location
          </p>
          <WeatherLocalisation
            mouseenter={mouseenter}
            mouseleave={mouseleave}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <p className=" my-2 self-center rounded-2xl border border-solid border-red-400 p-2 text-2xl">
            Radar
          </p>
          {isRadarRain && radarRain && (
            <WeatherRadar
              radar={radarRain}
              setradar={setRadarRain}
              isradarok={isRadarRain}
              setisradarok={setIsRadarDusted}
              timeTimer={200}
              tickDisplay={false}
            />
          )}
          {isRadarDusted && radarDust10 && radarDust25 && (
            <>
              <WeatherRadar
                radar={radarDust10}
                setradar={setRadarDust10}
                isradarok={isRadarDusted}
                setisradarok={setIsRadarRain}
                timeTimer={3000}
                tickDisplay={true}
              />
              <WeatherRadar
                radar={radarDust25}
                setradar={setRadarDust25}
                isradarok={isRadarDusted}
                setisradarok={setIsRadarRain}
                timeTimer={3000}
                tickDisplay={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
