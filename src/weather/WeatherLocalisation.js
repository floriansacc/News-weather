import WeatherUID from "./WeatherUID";

export default function WeatherLocalisation(props) {
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
      className={`${
        activetab !== 1 ? "flex" : "hidden"
      } flex-row justify-center w-fit sm:w-full h-full sm:mb-20 m-0`}
    >
      <WeatherUID
        handlecityselector={handlecityselector}
        cityselector={cityselector}
        dataimport={dataimport}
        displayinfo={displayinfo}
        srcimage={srcimage}
        loadstate={loadstate}
        loadforecast={loadforecast}
        reset={reset}
        refresh={refresh}
        raincond={raincond}
        humidity={humidity}
        hourrain={hourrain}
        temp={temp}
        winddir={winddir}
        windspeed={windspeed}
        tempforecast={tempforecast}
        skyforecast={skyforecast}
        rainforecast={rainforecast}
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        showbutton={showbutton}
        titlename={titlename}
        activetab={activetab}
      />
    </div>
  );
}
