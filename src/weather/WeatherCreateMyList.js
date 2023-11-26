import { useEffect, useState, useRef } from "react";
import WeatherUID from "./WeatherUID";

export default function WeatherCreateMyList(props) {
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
  } = props;
  const [liste, setListe] = useState([]);
  const [elem, setElem] = useState([]);
  const [listeCounter, setListeCounter] = useState(0);
  const [isFetch, setIsFetch] = useState(false);
  const [isFetch2, setIsFetch2] = useState(false);
  const [displayWeatherList, setDisplayWeatherList] = useState(false);

  const [weatherInfoNow, setWeatherInfoNow] = useState({});
  const [weatherForecast, setWeatherForecast] = useState({});
  const [skyForecast, setSkyForecast] = useState({});
  const [tempForecast, setTempForecast] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);

  const [countSlide, setCountSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
                word.Part1 === elem[0]
            )
            .map((x) => [x.nx, x.ny])
        )
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
      setListeCounter((prev) => prev + 1);
      window.console.log(listeCounter);
      setDisplayWeatherList(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setIsFetch(false);
      setIsFetch2(false);
      setCountSlide("0");
      document.getElementById("Displaybutton").style.background = "";
      document.getElementById("Displaybutton").style.color = "";
    }
  };

  const handleResetListe = (e) => {
    setListe([]);
    setDisplayWeatherList(false);
    setIsLoaded(false);
    setIsLoadedForecast(false);
    setIsFetch(false);
    setIsFetch2(false);
    setWeatherInfoNow({});
    setWeatherForecast({});
    setTempForecast({});
    setSkyForecast({});
    setListeCounter(0);
    setCountSlide("0");
    document.getElementById("Displaybutton").style.background = "";
    document.getElementById("Displaybutton").style.color = "";
  };

  const handleDisplayWeatherSlide = (e) => {
    if (isFetch && isFetch2 && displayWeatherList === false) {
      setDisplayWeatherList(true);
      setIsLoaded(true);
      setIsLoadedForecast(true);
      e.target.style.color = "#fff";
    }
    if (displayWeatherList === true) {
      setDisplayWeatherList(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      e.target.style.color = "";
      setCountSlide("0");
    }
  };

  const handleCommand = () => {
    window.console.log("MAP");
    window.console.log(weatherInfoNow);
    window.console.log("MAP2");
    window.console.log(weatherForecast);
    window.console.log(skyForecast);
    window.console.log(tempForecast);
  };

  const handleBullet = (e) => {
    setCountSlide(e.target.innerHTML);
  };

  const handleDisplayDescription = (e) => {
    document.getElementById("displaydescription").style.display =
      isFetch && isFetch2 ? "none" : "block";
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDisplayMouseLeave = (e) => {
    document.getElementById("displaydescription").style.display = "none";
  };

  const toStyleDisplayButton = {
    filter: isFetch && isFetch2 ? "" : "brightness(0.8)",
  };

  const toStyleDisplayDescription = {
    left: mousePosition.x,
    top: mousePosition.y + 15,
  };

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        let temporary = [];
        const urlWeatherList = `${weatherUrlNow}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${nx}&ny=${ny}`;
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
          await jsonResponse.response.body.items.item.map((x, i) => {
            temporary[i] = {
              phase1: name[0],
              phase2: name[1],
              phase3: name[2],
              category: x.category,
              value: x.obsrValue,
              time: x.baseTime,
              nx: nx,
              ny: ny,
            };
          });
          return [temporary, setIsFetch(true)];
        } catch (error) {
          console.log(error);
          setIsLoaded(false);
        }
      };
      let saveData = async () => {
        let resultsFirstFetch = await getWeatherList(
          [
            liste[listeCounter - 1]["Phase1"],
            liste[listeCounter - 1]["Phase2"],
            liste[listeCounter - 1]["Phase3"],
          ],
          liste[listeCounter - 1]["nx"],
          liste[listeCounter - 1]["ny"]
        );
        try {
          setWeatherInfoNow((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch[0],
          }));
        } catch (error) {
          window.console.log(error);
        }
      };
      setWeatherInfoNow((prev) => ({
        ...prev,
        [`${liste[listeCounter - 1]["Phase2"]} - ${
          liste[listeCounter - 1]["Phase3"]
        }`]: [],
      }));
      saveData();
    }
    return () => {
      setIsLoaded(false);
      setIsFetch(false);
    };
  }, [listeCounter]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        let temporary = [];
        const urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetimeforecast}&nx=${nx}&ny=${ny}`;
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
          jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              phase1: name[0],
              phase2: name[1],
              phase3: name[2],
              category: x.category,
              time: x.fcstTime,
              value: x.fcstValue,
              basetime: x.baseTime,
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
          return [temporary, setIsFetch2(true)];
        } catch (error) {
          console.log(error);
          setIsLoadedForecast(false);
        }
      };
      let saveData = async () => {
        let resultsFirstFetch = await getWeatherList(
          [
            liste[listeCounter - 1]["Phase1"],
            liste[listeCounter - 1]["Phase2"],
            liste[listeCounter - 1]["Phase3"],
          ],
          liste[listeCounter - 1]["nx"],
          liste[listeCounter - 1]["ny"]
        );
        try {
          setWeatherForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch[0].filter((x) => x.category === "PTY"),
          }));
          setSkyForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch[0].filter((x) => x.category === "SKY"),
          }));
          setTempForecast((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch[0].filter((x) => x.category === "T1H"),
          }));
        } catch (error) {
          window.console.log(error);
        }
      };
      setWeatherForecast((prev) => ({
        ...prev,
        [`${liste[listeCounter - 1]["Phase2"]} - ${
          liste[listeCounter - 1]["Phase3"]
        }`]: [],
      }));
      setTempForecast((prev) => ({
        ...prev,
        [`${liste[listeCounter - 1]["Phase2"]} - ${
          liste[listeCounter - 1]["Phase3"]
        }`]: [],
      }));
      setSkyForecast((prev) => ({
        ...prev,
        [`${liste[listeCounter - 1]["Phase2"]} - ${
          liste[listeCounter - 1]["Phase3"]
        }`]: [],
      }));
      saveData();
    }

    return () => {
      setIsLoaded(false);
      setIsFetch2(false);
    };
  }, [listeCounter]);

  useEffect(() => {
    if (isFetch && isFetch2) {
      document.getElementById("Displaybutton").style.borderColor = "red";
    }
    return () => {
      document.getElementById("Displaybutton").style.borderColor = "";
    };
  }, [isFetch, isFetch2]);

  useEffect(() => {
    return () => {
      //document.getElementById("displaydescription").style.display = "none";

      document.getElementById("displaydescription").style.bakcground = "red";
    };
  }, []);

  return (
    <div
      className={`${
        activetab !== 0 ? "flex" : "hidden"
      } items-center sm:flex-col md:flex-col flex-row-reverse flex-nowrap h-fit sm:w-full border border-solid border-red-600`}
    >
      <div
        className={`flex-shrink-0 flex-col flex-nowrap justify-start sm:w-11/12 w-96 sm:max-w-md sm:m-0 mx-6 bg-slate-700 h-96 rounded-3xl ${
          isLoaded ? "" : "animate-pulse-slow"
        }`}
      >
        <ul className="flex justify-center items-center list-none mx-4 my-1">
          {displayWeatherList &&
            liste.map((e, i) => (
              <li
                onClick={handleBullet}
                className={`inline-block relative m-1  indent-inf text-xs rounded-2xl  ${
                  countSlide === `${i}`
                    ? "w-6 h-6 bg-green-500"
                    : "w-5 h-5 bg-black transition-colors duration-150 ease-in delay-0 hover:animate-pulse hover:bg-green-300 cursor-pointer"
                }`}
                key={`bullet${i}`}
              >
                {i}
              </li>
            ))}
        </ul>

        {isLoaded && isLoadedForecast && (
          <WeatherUID
            dataimport={dataimport}
            srcimage={srcimage}
            loadstate={isLoaded}
            loadforecast={isLoadedForecast}
            raincond={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][0]
            }
            humidity={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][1]
            }
            hourrain={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][2]
            }
            temp={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][3]
            }
            winddir={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][5]
            }
            windspeed={
              weatherInfoNow[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ][7]
            }
            tempforecast={
              tempForecast[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ]
            }
            skyforecast={
              skyForecast[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ]
            }
            rainforecast={
              weatherForecast[
                `${liste[countSlide]["Phase2"]} - ${liste[countSlide]["Phase3"]}`
              ]
            }
            showbutton={false}
            titlename={true}
          />
        )}
      </div>
      <div className="flex flex-col justify-start items-start w-11/12 mt-12 border border-cyan-400 rounded-xl">
        <div className="flex flex-row flex-nowrap justify-start items-center w-full mt-12 border border-black rounded-xl">
          <div className="flex flex-col flex-nowrap items-center m-1">
            <button
              className="flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
              onClick={handleResetListe}
              onMouseEnter={mouseenter}
              onMouseLeave={mouseleave}
            >
              Reset
            </button>
            <button
              className="flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
              onClick={handleAddToList}
              onMouseEnter={mouseenter}
              onMouseLeave={mouseleave}
            >
              Add to my list
            </button>
          </div>
          <div>
            <label className="flex flex-col flex-nowrap">
              <select
                className="w-32 bg-inherit m-1 border-2 border-gray-300 rounded-xl"
                name="one"
                value={elem[0]}
                onChange={handleCitySelector}
              >
                <option name="one" value="선택" label="선택"></option>
                {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map(
                  (x, i) => {
                    return (
                      <option
                        name="one"
                        value={x}
                        label={x}
                        key={`optionlist1${i}`}
                      ></option>
                    );
                  }
                )}
              </select>
              <select
                className="w-32 bg-inherit m-1 border-2 border-gray-300 rounded-xl"
                name="two"
                value={elem[1]}
                onChange={handleCitySelector}
              >
                {Array.from(
                  new Set(
                    dataimport
                      .filter((word) => word.Part1 === elem[0])
                      .map((obj) => obj.Part2)
                  )
                ).map((x, i) => {
                  return (
                    <option
                      name="two"
                      value={x}
                      label={x}
                      key={`optionlist2${i}`}
                    ></option>
                  );
                })}
              </select>
              <select
                className="w-32 bg-inherit m-1 border-2 border-gray-300 rounded-xl"
                name="three"
                value={elem[2]}
                onChange={handleCitySelector}
              >
                {Array.from(
                  new Set(
                    dataimport
                      .filter(
                        (word) =>
                          word.Part2 === elem[1] && word.Part1 === elem[0]
                      )
                      .map((obj) => obj)
                  )
                ).map((x, i) => {
                  return (
                    <option
                      name="three"
                      value={x.Part3}
                      label={x.Part3}
                      key={`optionlist3${i}`}
                    ></option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>
        {liste[0] && <p className="mt-6">List of city to display:</p>}
        <div
          className={`${
            liste[0] ? "grid" : "hidden"
          }  grid-cols-3 auto-rows-t1 justify-items-center border border-solid border-black rounded-xl w-full my-4`}
        >
          {liste[0] && (
            <>
              <p className="font-semibold my-1">1단계</p>
              <p className="font-semibold my-1">2단계</p>
              <p className="font-semibold my-1">3단계</p>
            </>
          )}
          {liste.map((x, i) => (
            <>
              <p className="min-w-33 text-center" key={`p1${i}`}>
                {x.Phase1}
              </p>
              <p className="min-w-33 text-center" key={`p2${i}`}>
                {x.Phase2}
              </p>
              <p className="w-fit min-w-25 text-center" key={`p3${i}`}>
                {x.Phase3}
              </p>
            </>
          ))}
        </div>
        <div className="inline-flex flex-row flex-wrap w-full">
          <button
            className={`flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full whitespace-nowrap bg-gradient-to-r from-gray-300 to-gray-400
            ${isFetch && isFetch2 ? "brightness-100" : "brightness-75"}`}
            onMouseEnter={isFetch && isFetch2 ? mouseenter : null}
            onMouseLeave={
              isFetch && isFetch2 ? mouseleave : handleDisplayMouseLeave
            }
            onMouseMove={handleDisplayDescription}
            onClick={isFetch && isFetch2 ? handleDisplayWeatherSlide : null}
            id="Displaybutton"
          >
            Display Weather
          </button>
          <p
            style={toStyleDisplayDescription}
            className="absolute hidden px-1 py-1 bg-white w-fit h-fit border border-solid border-black rounded-3xl"
            id="displaydescription"
          >
            Need to fill the list before display
          </p>
          <button
            className="flex items-center m-1.5 p-1.5 h-8 border-2 border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
            onClick={handleCommand}
          >
            Console
          </button>
        </div>
      </div>
    </div>
  );
}
