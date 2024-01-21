import { useEffect, useState, useContext } from "react";
import WeatherUID from "./WeatherUID";
import MenuList from "./MenuList";
import ButtonOpenClose from "./ButtonOpenClose";
import { QueryContext } from "../App";
import useFetchCreateList from "../fetch/useFetchCreateList";
import WeatherPrediction from "./WeatherPrediction";
import WeatherNow from "./WeatherNow";
import WeatherLongTerm from "./WeatherLongTerm";
import WeatherPrediction24 from "./WeatherPrediction24";

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
    toggleTheme,
    isDarkTheme,
    previousBg,
    setPreviousBg,
  } = useContext(QueryContext);
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);

  const [refreshFetch, setRefreshFetch] = useState(0);
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
    accuRain,
    setAccuRain,
    accuSnow,
    setAccuSnow,
    isLoaded,
    setIsLoaded,
    isLoadedForecast,
    setIsLoadedForecast,
    isForecasted,
    setisForecasted,
    canRefersh,
  } = useFetchCreateList(liste, refreshFetch);

  let bgSet;

  const slider = document.getElementById("slider");
  let homeDiv = document.getElementById("home3");

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
    setAccuRain({});
    setAccuSnow({});
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

  const handleRefresh = (e) => {
    setRefreshFetch((prev) => prev + 1);
  };

  const handleBullet = (e) => {
    setCountSlide(parseInt(e.target.innerHTML));
  };

  const handleOverallMove = (e) => {
    if (!touchStart || !touchEnd) return;
    let minDist = e === "touch" ? 50 : resizew / 5;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minDist;
    const isRightSwipe = distance < -minDist;
    if (isLeftSwipe && countSlide !== liste.length - 1) {
      setCountSlide((prev) => prev + 1);
    } else if (isRightSwipe && countSlide !== 0) {
      setCountSlide((prev) => prev - 1);
    } else if (isRightSwipe && countSlide === 0) {
      setCountSlide(0);
      setToTranslate(0);
    } else if (isLeftSwipe && countSlide === liste.length - 1) {
      setCountSlide(liste.length - 1);
      setToTranslate(-homeDiv.offsetWidth * countSlide);
    } else if (!isLeftSwipe && !isRightSwipe) {
      setToTranslate(-homeDiv.offsetWidth * countSlide);
    }
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.target === document.getElementById("next-day-graph")) {
      window.console.log("Click on graph");
    } else {
      setIsDragging(true);
      setStartX(e.clientX - toTranslate);
      setTouchStart(e.clientX);
      setTouchEnd(null);
    }
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (isDragging) {
      const newTranslate = e.clientX - startX;
      setToTranslate(newTranslate);
    }
    setTouchEnd(e.clientX);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    handleOverallMove();
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.touches[0].clientX - toTranslate);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (isDragging) {
      const newTranslate = e.touches[0].clientX - startX;
      setToTranslate(newTranslate);
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    handleOverallMove("touch");
  };

  function bgFunction(i) {
    if (
      !weatherInfoNow ||
      !skyForecast ||
      !isLoaded ||
      !isLoadedForecast ||
      !liste[0]
    ) {
      if (previousBg) {
        bgSet = previousBg;
        return bgSet;
      }
      bgSet = "bg-yellow-100";
      return bgSet;
    } else {
      bgSet =
        skyForecast[
          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
        ][0].time.slice(0, 2) > 22 ||
        skyForecast[
          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
        ][0].time.slice(0, 2) < 7
          ? "bg-perso6"
          : (weatherInfoNow[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`][0]
                .value === "1" ||
                weatherInfoNow[
                  `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                ][0].value === "5" ||
                weatherInfoNow[
                  `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                ][0].value === "6") &&
              !(
                skyForecast[
                  `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                ][0].time.slice(0, 2) > 22 ||
                skyForecast[
                  `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                ][0].time.slice(0, 2) < 7
              )
            ? "bg-perso1"
            : (weatherInfoNow[
                  `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                ][0].value === "2" ||
                  weatherInfoNow[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][0].value === "3") &&
                !(
                  skyForecast[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][0].time.slice(0, 2) > 22 ||
                  skyForecast[
                    `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                  ][0].time.slice(0, 2) < 7
                )
              ? "bg-perso2"
              : skyForecast[`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`][0]
                    .value === "4" &&
                  !(
                    skyForecast[
                      `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                    ][0].time.slice(0, 2) > 22 ||
                    skyForecast[
                      `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                    ][0].time.slice(0, 2) < 7
                  )
                ? "bg-perso3"
                : skyForecast[
                      `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                    ][0].value === "3" &&
                    !(
                      skyForecast[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ][0].time.slice(0, 2) > 22 ||
                      skyForecast[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ][0].time.slice(0, 2) < 7
                    )
                  ? "bg-perso4"
                  : skyForecast[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ][0].value === "1" &&
                      !(
                        skyForecast[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ][0].time.slice(0, 2) > 22 ||
                        skyForecast[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ][0].time.slice(0, 2) < 7
                      )
                    ? "bg-perso5"
                    : "bg-red-100";
      bgSet === ("bg-perso6" || "bg-perso1")
        ? toggleTheme("dark")
        : toggleTheme("light");
      return bgSet;
    }
  }

  useEffect(() => {
    if (!homeDiv || !liste) return;
    setToTranslate(-homeDiv.offsetWidth * countSlide);
    setPreviousBg(bgFunction(countSlide));
  }, [countSlide]);

  useEffect(() => {
    setPreviousBg(bgFunction(countSlide));
  }, [displayWeatherList, liste]);

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
    homeDiv = document.getElementById("home3");
  }, []);

  useEffect(() => {
    if (fetchFail) {
      document.getElementById("resetbutton").style.background = "#d45950";
      document.getElementById("resetbutton").style.color = "white";
      document.getElementById("resetbutton").innerHTML = "Fail, click to reset";
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

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add(`overflow-hidden`);
    } else {
      document.body.classList.remove(`overflow-hidden`);
    }
    return () => {
      document.body.classList.remove(`overflow-hidden`);
    };
  }, [isDragging]);

  return (
    <div
      className={`${previousBg ? previousBg : ""} ${
        isDarkTheme ? "text-light" : "text-dark"
      } mt-4 flex min-h-full flex-shrink-0 flex-col flex-nowrap items-center justify-start overflow-hidden transition-bgground duration-75 ease-in scrollbar-hide sm:m-0 sm:w-full sm:flex-col sm:flex-nowrap md:m-0 md:w-full md:flex-col md:flex-nowrap lg:h-fit lg:w-[45%] lg:min-w-0 lg:flex-row-reverse lg:flex-wrap lg:rounded-2xl `}
      onClick={() => (menuOn ? setMenuOn(false) : null)}
      onDragStart={(e) => e.preventDefault()}
      id="home3"
    >
      {(!isLoaded || !isForecasted || !isLoadedForecast) && (
        <button
          className={`m-1.5 mb-0 flex h-8 w-fit items-center self-end rounded-full border border-solid border-white/50 p-1.5 ${
            canRefersh
              ? "pointer-events-auto bg-gradient-to-r from-gray-300/25 to-gray-700/25"
              : "pointer-events-none bg-gradient-to-r from-red-300/75 to-red-700/75"
          }`}
          onClick={handleRefresh}
          onMouseEnter={mouseenter}
          onMouseLeave={mouseleave}
          id="refresh-button"
        >
          Refresh fetch
        </button>
      )}
      {lastSessionListe !== null && !displayWeatherList && (
        <p className="p-10 text-2xl">Retrieving last list</p>
      )}
      {displayWeatherList && (
        <ul
          id="slider"
          style={{
            transform: `translate3d(${toTranslate}px, 0, 0)`,
          }}
          className={`relative z-20 flex h-fit w-full justify-start ${
            !isDragging ? "transition-all" : ""
          } `}
        >
          {liste.map((x, i) => (
            <div
              className={`z-10 m-0 box-border flex h-fit w-fit min-w-full select-none flex-col flex-nowrap items-center justify-start duration-500 sm:w-full md:w-full lg:w-[45%] lg:rounded-2xl`}
            >
              {isLoaded && isLoadedForecast && (
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <WeatherNow
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
                    skyforecast={
                      skyForecast[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ]
                    }
                  />
                </div>
              )}
              {isLoadedForecast && isForecasted && (
                <>
                  <div className="m-2 mb-0 w-full p-2 pb-6">
                    <WeatherPrediction24
                      highestnextdays={
                        highestNextDays[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ]
                      }
                      tempnextdays={
                        tempNextDays[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ]
                      }
                      skynextdays={
                        skyNextDays[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ]
                      }
                      rainnextdays={
                        rainNextDays[
                          `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                        ]
                      }
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    />
                  </div>
                  <WeatherLongTerm
                    highestnextdays={
                      highestNextDays[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ]
                    }
                    tempnextdays={
                      tempNextDays[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ]
                    }
                    skynextdays={
                      skyNextDays[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ]
                    }
                    rainnextdays={
                      rainNextDays[
                        `${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`
                      ]
                    }
                    isforecasted={isForecasted}
                  />
                </>
              )}
            </div>
          ))}
        </ul>
      )}
      {displayWeatherList && (
        <ul className="fixed bottom-0 left-0 z-50 mb-2 flex h-fit w-[60%] list-none items-center justify-center self-start rounded-2xl px-3">
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
              {touchStart ? "OUI" : "NON"}
            </li>
            <li
              className={`${
                isDragging === true ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {touchEnd ? "OUI" : "NON"}
            </li>
          </div>
          <div className="hidden flex-col">
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
        setliste={setListe}
        cityselector={handleCitySelector}
        resetlist={handleResetListe}
        weatherslide={handleDisplayWeatherSlide}
        displayon={displayWeatherList}
        savelist={handleSaveList}
        countslide={countSlide}
        setcountslide={setCountSlide}
      />
      <ButtonOpenClose
        menuListOn={menuListOn}
        setMenuListOn={setMenuListOn}
        foropen={false}
      />
    </div>
  );
}
