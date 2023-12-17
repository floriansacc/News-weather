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
  } = props;
  return (
    <div
      className="flex h-full w-11/12 flex-row flex-wrap items-center justify-around bg-slate-100 sm:w-full sm:flex-col sm:flex-nowrap sm:items-center md:w-full md:flex-col md:flex-nowrap lg:m-2 lg:h-fit"
      onClick={() => (menuon ? setmenuon(false) : null)}
    >
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
        size="fit"
      />

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
      />
    </div>
  );
}
