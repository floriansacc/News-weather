import { useContext } from "react";
import useFetchPartRadar from "../fetch/useFetchPartRadar";
import useFetchRadar from "../fetch/useFetchRadar";
import WeatherRadarParticle from "./components/WeatherRadarParticle";
import WeatherRadarRain from "./components/WeatherRadarRain";
import { QueryContext } from "../layout/RootLayout";

export default function WeatherRadars(props) {
  const { menuOn, setMenuOn, isDarkTheme, previousBg } =
    useContext(QueryContext);

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

  return (
    <div
      className={` ${isDarkTheme ? "text-light" : ""} ${
        previousBg ? "previousBg" : "bg-perso6 text-light"
      } flex h-fit w-full flex-col flex-wrap items-start justify-around overflow-hidden sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit`}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      <div className="mt-20 flex w-full flex-col items-center justify-center">
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
  );
}
