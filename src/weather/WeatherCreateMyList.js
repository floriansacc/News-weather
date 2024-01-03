import { useEffect, useState, useContext } from "react";
import WeatherUID from "./WeatherUID";
import MenuList from "./MenuList";
import ButtonOpenClose from "./ButtonOpenClose";
import { QueryContext } from "../App";
import useFetchCreateList from "../fetch/useFetchCreateList";

export default function WeatherCreateMyList(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const {
    dataimport,
    menuOn,
    setMenuOn,
    menuListOn,
    setMenuListOn,
    activeTab,
    lastSessionListe,
    setLastSessionListe,
  } = useContext(QueryContext);
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);

  const [fetchFail, setFetchFail] = useState(false);
  const [displayWeatherList, setDisplayWeatherList] = useState(false);
  const [countSlide, setCountSlide] = useState(0);
  const [toTranslate, setToTranslate] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const {
    listeCounter,
    setListeCounter,
    listSaved,
    setListSaved,
    isFetch,
    setIsFetch,
    weatherInfoNow,
    setWeatherInfoNow,
    weatherForecast,
    setWeatherForecast,
    skyForecast,
    setSkyForecast,
    tempForecast,
    setTempForecast,
    highestNextDays,
    setHighestNextDays,
    tempNextDays,
    setTempNextDays,
    skyNextDays,
    setSkyNextDays,
    rainNextDays,
    setRainNextDays,
    isLoaded,
    setIsLoaded,
    isLoadedForecast,
    setIsLoadedForecast,
    isForecasted,
    setisForecasted,
  } = useFetchCreateList(liste);

  const slider = document.getElementById("slider");

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const weatherNextDay =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  const handleCitySelector = (e) => {
    if (e.target.name === "one") {
      setElem([e.target.value]);
    } else if (e.target.name === "two") {
      setElem([elem[0], e.target.value]);
    } else if (e.target.name === "three") {
      let [coord] = Array.from(
        new Set(
          dataimport
            .filter(
              (word) =>
                word.Part3 === e.target.value &&
                word.Part2 === elem[1] &&
                word.Part1 === elem[0],
            )
            .map((x) => [x.nx, x.ny]),
        ),
      );
      setElem([elem[0], elem[1], e.target.value, coord[0], coord[1]]);
    }
  };

  const handleAddToList = () => {
    if (
      liste.some((e) => e.Phase3 === elem[2] && e.Phase2 === elem[1]) ||
      !elem[2]
    ) {
      window.console.log("nothing to add");
      return false;
    } else {
      setListe((prev) => [
        ...prev,
        {
          Phase1: elem[0],
          Phase2: elem[1],
          Phase3: elem[2],
          nx: elem[3],
          ny: elem[4],
        },
      ]);
      setElem(["선택"]);
      setListeCounter(liste.length + 1);
      setDisplayWeatherList(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setIsFetch(false);
      setisForecasted(false);
      setCountSlide(0);
      document.getElementById("resetbutton").style.background = "";
      document.getElementById("resetbutton").style.color = "";
      document.getElementById("resetbutton").style.innerHTML = "";
    }
  };

  const handleResetListe = (e) => {
    setListe([]);
    setDisplayWeatherList(false);
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setIsFetch(false);
    setisForecasted(false);
    setFetchFail(false);
    setWeatherInfoNow({});
    setWeatherForecast({});
    setTempForecast({});
    setSkyForecast({});
    setListeCounter(0);
    setCountSlide(0);
    sessionStorage.setItem("lastValue", null);
    setLastSessionListe(null);
    setListSaved(false);
    document.getElementById("resetbutton").style.borderColor = "";
    document.getElementById("resetbutton").style.background = "";
    document.getElementById("resetbutton").style.color = "";
    document.getElementById("resetbutton").innerHTML = "Reset";
    document.getElementById("Displaybutton").style.borderColor = "";
    document.getElementById("Displaybutton").style.color = "";
  };

  const handleDisplayWeatherSlide = (e) => {
    if (isFetch && !displayWeatherList) {
      setDisplayWeatherList(true);
      e.target.style.color = "#fff";
    }
    if (displayWeatherList) {
      setDisplayWeatherList(false);
      e.target.style.color = "";
    }
  };

  const handleSaveList = (e) => {
    sessionStorage.setItem("lastValue", JSON.stringify(liste));
    setLastSessionListe(liste);
  };

  const handleBullet = (e) => {
    setCountSlide(parseInt(e.target.innerHTML));
  };

  const handleOverallMove = (e) => {
    let minDist = e === "touch" ? 50 : resizew / 3;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minDist;
    const isRightSwipe = distance < -minDist;
    if (isLeftSwipe && countSlide !== liste.length - 1) {
      setCountSlide((prev) => prev + 1);
      window.console.log("left swipe");
    } else if (isRightSwipe && countSlide !== 0) {
      setCountSlide((prev) => prev - 1);
      window.console.log("right swipe");
    } else if (isRightSwipe && countSlide === 0) {
      setCountSlide(0);
      setToTranslate(0);
    } else if (isLeftSwipe && countSlide === liste.length - 1) {
      setCountSlide(liste.length - 1);
      setToTranslate(-resizew * countSlide);
    } else if (!isLeftSwipe && !isRightSwipe) {
      setToTranslate(-resizew * countSlide);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
    setStartX(e.clientX - toTranslate);
    setTouchStart(e.clientX);
    setTouchEnd(null);
  };

  const handlePointerMove = (e) => {
    if (isDragging && slider.offsetWidth - 100 < resizew) {
      const newTranslate = e.clientX - startX;
      setToTranslate(newTranslate);
    }
    setTouchEnd(e.clientX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    handleOverallMove();
  };

  const handlePointerUpDocument = (e) => {
    if (isDragging) {
      setIsDragging(false);
    }
    handleOverallMove();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - toTranslate);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const newTranslate = e.touches[0].clientX - startX;
      setToTranslate(newTranslate);
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    handleOverallMove("touch");
  };

  useEffect(() => {
    document.addEventListener("pointerup", handlePointerUpDocument);
    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      document.removeEventListener("pointerup", handlePointerUpDocument);
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDragging]);

  useEffect(() => {
    setToTranslate(-resizew * countSlide);
  }, [countSlide]);

  useEffect(() => {
    document.getElementById("resetbutton").style.borderColor = "";
    document.getElementById("resetbutton").style.background = "";
    document.getElementById("resetbutton").innerHTML = "Reset";
  }, [listeCounter]);

  useEffect(() => {
    !lastSessionListe && activeTab === 2
      ? setMenuListOn(true)
      : setMenuListOn(false);
    document.getElementById("displaydescription").style.background = "#d45950";
    if (!lastSessionListe) {
      setListe([]);
      sessionStorage.setItem("lastValue", null);
    } else if (lastSessionListe && typeof lastSessionListe === "object") {
      setListe(lastSessionListe);
      setListSaved(true);
    }
  }, []);

  useEffect(() => {
    if (fetchFail) {
      document.getElementById("resetbutton").style.background = "#d45950";
      document.getElementById("resetbutton").style.color = "white";
      document.getElementById("resetbutton").innerHTML = "Fail, click to reset";
      window.console.log("Fetch fail");
    }
    if (isFetch && !displayWeatherList) {
      setToTranslate(0);
      setDisplayWeatherList(true);
      document.getElementById("Displaybutton").style.borderColor = "#d45950";
      document.getElementById("Displaybutton").style.color = "#fff";
    }
    if (displayWeatherList) {
      setDisplayWeatherList(false);
      setCountSlide(0);
      document.getElementById("Displaybutton").style.color = "";
    }
  }, [isFetch, fetchFail]);

  return (
    <div
      className={`mt-4 flex h-fit min-h-screen flex-shrink-0 flex-col flex-nowrap items-center justify-start bg-slate-100 scrollbar-hide sm:m-0 sm:w-full sm:flex-col sm:flex-nowrap md:m-0 md:w-full md:flex-col md:flex-nowrap lg:h-fit lg:w-full lg:flex-row-reverse lg:flex-wrap`}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
    >
      {lastSessionListe !== null && !displayWeatherList && (
        <p className="p-10 text-2xl">Retrieving last list</p>
      )}
      {displayWeatherList && (
        <ul
          id="slider"
          style={{
            transform: `translate3d(${toTranslate}px, 0, 0)`,
          }}
          className={`relative z-20 flex h-full w-full touch-pan-x justify-start ${
            !isDragging ? "transition-all" : ""
          } `}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {liste.map((x, i) => (
            <li key={i}>
              <WeatherUID
                loadstate={isLoaded}
                loadforecast={isLoadedForecast}
                raincond={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][0]
                }
                humidity={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][1]
                }
                hourrain={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][2]
                }
                temp={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][3]
                }
                winddir={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][5]
                }
                windspeed={
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][7]
                }
                tempforecast={
                  tempForecast[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]
                }
                skyforecast={
                  skyForecast[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]
                }
                rainforecast={
                  weatherForecast[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ]
                }
                highestnextday={
                  highestNextDays[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ]
                }
                tempnextdays={
                  tempNextDays[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]
                }
                skynextdays={
                  skyNextDays[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]
                }
                rainnextdays={
                  rainNextDays[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]
                }
                isforecasted={isForecasted}
                showbutton={false}
                titlename={true}
                forlist={true}
                resizew={resizew}
              />
            </li>
          ))}
        </ul>
      )}
      {displayWeatherList && (
        <ul className="absolute bottom-0 left-0 z-50 flex h-8 w-4/6 list-none items-center justify-center self-start rounded-2xl px-4 pb-7">
          {liste.map((e, i) => (
            <li
              onClick={handleBullet}
              className={`relative mx-1 inline-block h-6 w-full rounded-2xl border border-solid border-green-100 indent-inf text-xs ${
                countSlide === i
                  ? "bg-purpleflo"
                  : " cursor-pointer bg-black transition-all delay-0 duration-200 ease-in hover:scale-105 hover:animate-pulse hover:bg-purpleflo"
              }`}
              key={`bullet${i}`}
            >
              {i}
            </li>
          ))}
          <div className="hidden flex-col">
            <li
              className={`${
                isDragging === true ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isDragging ? "OUI" : "NON"}
            </li>
            <li>{countSlide}</li>
          </div>
          <div className=" flex-col">
            <li>{toTranslate.toFixed(2)}</li>
            <li>{startX.toFixed(2)}</li>
          </div>
        </ul>
      )}
      <MenuList
        addtolist={handleAddToList}
        mouseenter={mouseenter}
        mouseleave={mouseleave}
        fetchcheck={[isFetch, fetchFail]}
        elem={elem}
        liste={liste}
        cityselector={handleCitySelector}
        resetlist={handleResetListe}
        weatherslide={handleDisplayWeatherSlide}
        displayon={displayWeatherList}
        savelist={handleSaveList}
      />
      <ButtonOpenClose
        menuListOn={menuListOn}
        setMenuListOn={setMenuListOn}
        foropen={false}
      />
    </div>
  );
}
