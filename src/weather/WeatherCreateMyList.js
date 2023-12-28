import { useEffect, useState, useRef, useContext } from "react";
import WeatherUID from "./WeatherUID";
import MenuList from "./MenuList";
import ButtonOpenClose from "./ButtonOpenClose";
import { QueryContext } from "../GlobalBody";

export default function WeatherCreateMyList(props) {
  const { mouseenter, mouseleave, resizew } = props;
  const {
    dataimport,
    menuOn,
    setMenuOn,
    menuListOn,
    setMenuListOn,
    lastSessionListe,
    setLastSessionListe,
    activeTab,
    images,
    updateDates,
    serviceKey,
    baseDate,
    baseTime,
    baseTimeForecast,
  } = useContext(QueryContext);
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);
  const [listeCounter, setListeCounter] = useState(0);
  const [listSaved, setListSaved] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [fetchFail, setFetchFail] = useState(false);
  const [displayWeatherList, setDisplayWeatherList] = useState(false);

  const [weatherInfoNow, setWeatherInfoNow] = useState({});
  const [weatherForecast, setWeatherForecast] = useState({});
  const [skyForecast, setSkyForecast] = useState({});
  const [tempForecast, setTempForecast] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);

  const [countSlide, setCountSlide] = useState(0);
  const [toTranslate, setToTranslate] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const slider = document.getElementById("slider");

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

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
    setFetchFail(false);
    setWeatherInfoNow({});
    setWeatherForecast({});
    setTempForecast({});
    setSkyForecast({});
    setListeCounter(0);
    setCountSlide(0);
    sessionStorage.setItem("lastValue", null);
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
  };

  const handleBullet = (e) => {
    setCountSlide(parseInt(e.target.innerHTML));
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX - toTranslate);
  };

  const handlePointerMove = (e) => {
    if (isDragging && slider.offsetWidth - 100 < resizew) {
      const newTranslate = e.clientX - startX;
      setToTranslate(newTranslate);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
  };

  const handlePointerUpDocument = (e) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - toTranslate);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const newTranslate = e.touches[0].clientX - startX;
      setToTranslate(newTranslate);
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("pointerup", handlePointerUpDocument);
    document.addEventListener("pointermove", handlePointerMove);
    if (isDragging) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("pointerup", handlePointerUpDocument);
      document.removeEventListener("pointermove", handlePointerMove);
      document.body.style.overflow = "";
    };
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) return;
    if (
      countSlide >= 0 &&
      countSlide < liste.length - 1 &&
      -toTranslate > resizew * (countSlide + 1) - resizew * 0.6
    ) {
      setCountSlide((prev) => prev + 1);
    } else if (
      countSlide > 0 &&
      countSlide < liste.length &&
      -toTranslate < resizew * countSlide - resizew * 0.4
    ) {
      setCountSlide((prev) => prev - 1);
    } else if (
      -toTranslate < resizew * (countSlide + 1) - resizew * 0.6 &&
      -toTranslate > resizew * countSlide - resizew * 0.4
    ) {
      setCountSlide((prev) => prev);
      setToTranslate(-resizew * countSlide);
    } else if (
      countSlide === 0 &&
      -toTranslate < resizew * countSlide - resizew * 0.4
    ) {
      setCountSlide(0);
      setToTranslate(0);
    } else if (
      countSlide === liste.length - 1 &&
      -toTranslate > resizew * (countSlide + 1) - resizew * 0.6
    ) {
      setCountSlide(liste.length - 1);
      setToTranslate(-resizew * countSlide);
    }
  }, [isDragging]);

  useEffect(() => {
    setToTranslate(-resizew * countSlide);
  }, [countSlide]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherListNow = async (name, nx, ny) => {
        let temporary = [];
        let urlWeatherList = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherList, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            "LIST",
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              value: x.obsrValue,
              time: x.baseTime,
              nx: nx,
              ny: ny,
            };
            temporary[i] = newData;
          });
          return temporary;
        } catch (error) {
          console.log(`Premier fetch error: ${error}`);
          setIsLoaded(false);
        }
      };
      const getWeatherListForecast = async (name, nx, ny) => {
        let temporary = [];
        let urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherForecast, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `List Predi ${name}`,
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              time: x.fcstTime,
              value: x.fcstValue,
              baseTime: x.baseTime,
              nx: x.nx,
              ny: x.ny,
            };
            if (x.category === "PTY") {
              temporary[i] = newData;
            } else if (x.category === "T1H") {
              temporary[i] = newData;
            } else if (x.category === "SKY") {
              temporary[i] = newData;
            }
          });
          return temporary;
        } catch (error) {
          console.log(`Second fetch error: ${error}`);
          setIsLoadedForecast(false);
        }
      };
      let saveDataNow = async () => {
        try {
          let resultsFirstFetch = await getWeatherListNow(
            [
              liste[listeCounter - 1]["Phase1"],
              liste[listeCounter - 1]["Phase2"],
              liste[listeCounter - 1]["Phase3"],
            ],
            liste[listeCounter - 1]["nx"],
            liste[listeCounter - 1]["ny"],
          );
          setWeatherInfoNow((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch ? resultsFirstFetch : [],
          }));
        } catch (error) {
          window.console.log(error);
          setIsLoaded(false);
        }
      };
      let saveDataForecast = async () => {
        try {
          let resultsFirstFetch = await getWeatherListForecast(
            [
              liste[listeCounter - 1]["Phase1"],
              liste[listeCounter - 1]["Phase2"],
              liste[listeCounter - 1]["Phase3"],
            ],
            liste[listeCounter - 1]["nx"],
            liste[listeCounter - 1]["ny"],
          );
          setSkyForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "SKY")
              : [],
          }));
          setWeatherForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "PTY")
              : [],
          }));
          setTempForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "T1H")
              : [],
          }));
        } catch (error) {
          window.console.log(error);
          setIsLoadedForecast(false);
        }
      };
      Promise.all([saveDataNow(), saveDataForecast()]).then(() => {
        window.console.log("He oui mon gars ca marche");
        setIsFetch(true);
        setIsLoaded(true);
        setIsLoadedForecast(true);
      });
    }
    return () => {
      setIsFetch(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
    };
  }, [listeCounter]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherListNow = async (name, nx, ny) => {
        let temporary = [];
        let urlWeatherList = `${weatherUrlNow}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherList, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            "LIST",
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              value: x.obsrValue,
              time: x.baseTime,
              nx: nx,
              ny: ny,
            };
            temporary[i] = newData;
          });
          return temporary;
        } catch (error) {
          console.log(`Premier fetch error: ${error}`);
          setIsLoaded(false);
        }
      };
      const getWeatherListForecast = async (name, nx, ny) => {
        let temporary = [];
        let urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${serviceKey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${baseTimeForecast}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherForecast, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `List Predi ${name}`,
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              time: x.fcstTime,
              value: x.fcstValue,
              baseTime: x.baseTime,
              nx: x.nx,
              ny: x.ny,
            };
            if (x.category === "PTY") {
              temporary[i] = newData;
            } else if (x.category === "T1H") {
              temporary[i] = newData;
            } else if (x.category === "SKY") {
              temporary[i] = newData;
            }
          });
          return temporary;
        } catch (error) {
          console.log(`Second fetch error: ${error}`);
          setIsLoadedForecast(false);
        }
      };
      let saveDataNow = async () => {
        for (let i in liste) {
          try {
            let resultsFirstFetch = await getWeatherListNow(
              [liste[i]["Phase1"], liste[i]["Phase2"], liste[i]["Phase3"]],
              liste[i]["nx"],
              liste[i]["ny"],
            );
            setWeatherInfoNow((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch ? resultsFirstFetch : [],
            }));
          } catch (error) {
            window.console.log(error);
            setIsLoaded(false);
          }
        }
      };
      let saveDataForecast = async () => {
        for (let i in liste) {
          try {
            let resultsFirstFetch = await getWeatherListForecast(
              [liste[i]["Phase1"], liste[i]["Phase2"], liste[i]["Phase3"]],
              liste[i]["nx"],
              liste[i]["ny"],
            );
            setSkyForecast((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "SKY")
                  : [],
            }));
            setWeatherForecast((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "PTY")
                  : [],
            }));
            setTempForecast((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "T1H")
                  : [],
            }));
          } catch (error) {
            window.console.log(error);
            setIsLoadedForecast(false);
          }
        }
      };
      Promise.all([saveDataNow(), saveDataForecast()]).then(() => {
        window.console.log("All fetch finished");
        setIsFetch(true);
        setIsLoaded(true);
        setIsLoadedForecast(true);
      });
    }
    return () => {
      setIsFetch(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
    };
  }, [listSaved]);

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

  /*const handleCommand = () => {
    window.console.log("MAP");
    window.console.log(weatherInfoNow);
    window.console.log("MAP2");
    window.console.log(weatherForecast);
    window.console.log(skyForecast);
    window.console.log(tempForecast);
    window.console.log(liste.length);
  };*/

  return (
    <div
      className={`mt-4 flex h-screen flex-shrink-0 flex-col flex-nowrap items-center justify-start bg-slate-100 scrollbar-hide sm:m-0 sm:w-full sm:flex-col sm:flex-nowrap md:m-0 md:w-full md:flex-col md:flex-nowrap lg:h-fit lg:w-full lg:flex-row-reverse lg:flex-wrap `}
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
          className={`relative z-20 flex h-full w-full justify-start ${
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
          <div className="hidden flex-col">
            <li>{toTranslate.toFixed(2)}</li>
            <li>{resizew.toFixed(2)}</li>
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
