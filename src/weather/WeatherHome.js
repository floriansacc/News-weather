import WeatherCreateMyList from "./WeatherCreateMyList";
import WeatherLocalisation from "./WeatherLocalisation";

export default function WeatherHome(props) {
  const {
    dataimport,
    mouseenter,
    mouseleave,
    basetime,
    basetimeforecast,
    servicekey,
    srcimage,
    updatedate,
    basedate,
    activetab,
    resizew,
    menuon,
    setmenuon,
    menuliston,
    setmenuliston,
  } = props;
  return (
    <div
      className="justify-aroun flex h-fit w-11/12 flex-row flex-wrap items-center  sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit"
      onClick={() => (menuon ? setmenuon(false) : null)}
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
      <WeatherLocalisation
        dataimport={dataimport}
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        basetime={basetime}
        basetimeforecast={basetimeforecast}
        servicekey={servicekey}
        srcimage={srcimage}
        updatedate={updatedate}
        basedate={basedate}
        activetab={activetab}
        menuliston={menuliston}
        setmenuliston={setmenuliston}
      />
      <p className="my-2 rounded-2xl border border-solid border-red-400 p-2 text-2xl">
        List
      </p>
      <WeatherCreateMyList
        dataimport={dataimport}
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        basetime={basetime}
        basetimeforecast={basetimeforecast}
        servicekey={servicekey}
        srcimage={srcimage}
        updatedate={updatedate}
        basedate={basedate}
        activetab={activetab}
        resizew={resizew}
        menuliston={menuliston}
        setmenuliston={setmenuliston}
        closemenu={false}
      />
    </div>
  );
}
