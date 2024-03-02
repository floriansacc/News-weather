import { useContext } from "react";
import WeatherLocalisation from "./WeatherLocalisation";
import { QueryContext } from "../layout/RootLayout";
import useFetchRadar from "../fetch/useFetchRadar";
import WeatherRadarRain from "./components/WeatherRadarRain";
import useFetchPartRadar from "../fetch/useFetchPartRadar";
import WeatherRadarParticle from "./components/WeatherRadarParticle";
import { LinearTextGradient } from "react-text-gradients-and-animations";

export default function WeatherHome(props) {
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
    dustCause10,
    setDustCause10,
    dustCause25,
    setDustCause25,
  } = useFetchPartRadar();

  const colorTitles = isDarkTheme
    ? ["#37d67a", "#0000FF"]
    : ["#d637c4", "#f8ff00"];

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
      <div className="flex w-full flex-col items-start justify-around sm:items-center md:items-center lg:flex-row">
        <div className="flex w-[93%] flex-col lg:w-[40%]">
          <LinearTextGradient
            angle={45}
            colors={["#974ee7", "#218fff"]}
            animate={true}
            animateDirection={"horizontal"}
            animateDuration={5}
            className="my-2 self-center p-2 text-4xl font-bold sm:text-2xl"
          >
            Location
          </LinearTextGradient>

          <WeatherLocalisation />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <LinearTextGradient
            angle={45}
            colors={["#974ee7", "#218fff"]}
            animate={true}
            animateDirection={"horizontal"}
            animateDuration={5}
            className="my-2 self-center p-2 text-4xl font-bold sm:text-2xl"
          >
            Radar
          </LinearTextGradient>
          {isRadarRain && radarRain && (
            <WeatherRadarRain
              radar={radarRain}
              setradar={setRadarRain}
              isradarok={isRadarRain}
              setisradarok={setIsRadarDusted}
              timeTimer={200}
              tickDisplay={false}
              iddiv={0}
            />
          )}
          {isRadarDusted && radarDust10 && radarDust25 && (
            <WeatherRadarParticle
              radar1={radarDust10}
              setradar1={setRadarDust10}
              radar2={radarDust25}
              setradar2={setRadarDust25}
              isradarok={isRadarDusted}
              setisradarok={setIsRadarRain}
              cause1={dustCause10}
              cause2={dustCause25}
              timeTimer={3000}
              tickDisplay={true}
              iddiv={1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
