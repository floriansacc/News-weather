import { useState, useEffect, useContext } from "react";
import { QueryContext } from "../App";

export default function useFetchCreateList(liste, refreshFetch) {
  const {
    serviceKey,
    baseDate,
    tomorrowDate,
    afterTomorrowDate,
    baseTime,
    baseTimeForecast,
    futureTime,
  } = useContext(QueryContext);

  const [listeCounter, setListeCounter] = useState(0);
  const [listSaved, setListSaved] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [canRefersh, setCanRefresh] = useState(null);

  const [weatherInfoNow, setWeatherInfoNow] = useState({});
  const [weatherForecast, setWeatherForecast] = useState({});
  const [skyForecast, setSkyForecast] = useState({});
  const [tempForecast, setTempForecast] = useState({});
  const [highestNextDays, setHighestNextDays] = useState({});
  const [tempNextDays, setTempNextDays] = useState({});
  const [skyNextDays, setSkyNextDays] = useState({});
  const [rainNextDays, setRainNextDays] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedForecast, setIsLoadedForecast] = useState(false);
  const [isForecasted, setisForecasted] = useState(false);

  const weatherUrlNow =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const weatherUrlForecast =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
  const weatherNextDay =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

  useEffect(() => {
    if (!liste[0] && !listSaved) {
      window.console.log("no first fetch");
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
            `List ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
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
          return Promise.reject(error);
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
            `List Forecast ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
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
          return Promise.reject(error);
        }
      };
      const getWeatherNextDays = async (name, nx, ny) => {
        let temporary = [];
        const getUrlWeatherNextDay = `${weatherNextDay}?serviceKey=${serviceKey}&numOfRows=800&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${futureTime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(getUrlWeatherNextDay, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `List next day ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              date: x.fcstDate,
              value: x.fcstValue,
              time: x.fcstTime,
              nx: nx,
              ny: ny,
            };
            if (
              (x.category === "TMN" || x.category === "TMX") &&
              (x.fcstDate === tomorrowDate || x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "TMP" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "SKY" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "PTY" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            }
          });
          return temporary;
        } catch (error) {
          window.console.log(error);
          setisForecasted(false);
          return Promise.reject(error);
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
          return Promise.reject(error);
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
          return Promise.reject(error);
        }
      };
      let saveDataNextDays = async () => {
        try {
          let resultsFirstFetch = await getWeatherNextDays(
            [
              liste[listeCounter - 1]["Phase1"],
              liste[listeCounter - 1]["Phase2"],
              liste[listeCounter - 1]["Phase3"],
            ],
            liste[listeCounter - 1]["nx"],
            liste[listeCounter - 1]["ny"],
          );
          setHighestNextDays((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter(
                  (x) => x.category === "TMN" || x.category === "TMX",
                )
              : [],
          }));
          setSkyNextDays((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "SKY")
              : [],
          }));
          setRainNextDays((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "PTY")
              : [],
          }));
          setTempNextDays((prev) => ({
            ...prev,
            [`${liste[listeCounter - 1]["Phase2"]} - ${
              liste[listeCounter - 1]["Phase3"]
            }`]: resultsFirstFetch
              ? resultsFirstFetch.filter((x) => x.category === "TMP")
              : [],
          }));
        } catch (error) {
          window.console.log(error);
          setisForecasted(false);
          return Promise.reject(error);
        }
      };
      Promise.all([(saveDataNow(), saveDataForecast(), saveDataNextDays())])
        .then(() => {
          window.console.log("New addition succes");
          setIsFetch(true);
          setIsLoaded(true);
          setIsLoadedForecast(true);
          setisForecasted(true);
          setCanRefresh(true);
        })
        .catch((e) => {
          window.console.log(`New addition failed: ${e}`);
          setCanRefresh(true);
        });
    }
    return () => {
      setIsFetch(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setisForecasted(false);
      setCanRefresh(false);
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
            `Saved list ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
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
          window.console.log(`Premier fetch error: ${error}`);
          setIsLoaded(false);
          return Promise.reject(error);
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
            `Saved list Forecast ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
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
          window.console.log(`Second fetch error: ${error}`);
          setIsLoadedForecast(false);
          return Promise.reject(error);
        }
      };
      const getWeatherNextDays = async (name, nx, ny) => {
        let temporary = [];
        const getUrlWeatherNextDay = `${weatherNextDay}?serviceKey=${serviceKey}&numOfRows=800&dataType=JSON&pageNo=1&base_date=${baseDate}&base_time=${futureTime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(getUrlWeatherNextDay, {
            headers: {
              Accept: "application / json",
            },
          });
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `Saved list next day ${name[0]} ${name[1]}`,
            jsonResponse.response.header["resultMsg"],
          ]);
          await jsonResponse.response.body.items.item.forEach((x, i) => {
            let newData = {
              Phase1: name[0],
              Phase2: name[1],
              Phase3: name[2],
              category: x.category,
              date: x.fcstDate,
              value: x.fcstValue,
              time: x.fcstTime,
              nx: nx,
              ny: ny,
            };
            if (
              (x.category === "TMN" || x.category === "TMX") &&
              (x.fcstDate === tomorrowDate || x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "TMP" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "SKY" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            } else if (
              x.category === "PTY" &&
              (x.fcstDate === baseDate ||
                x.fcstDate === tomorrowDate ||
                x.fcstDate === afterTomorrowDate)
            ) {
              temporary[i] = newData;
            }
          });
          return temporary;
        } catch (error) {
          window.console.log(error);
          setisForecasted(false);
          return Promise.reject(error);
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
            return Promise.reject(error);
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
            return Promise.reject(error);
          }
        }
      };
      let saveDataNextDays = async () => {
        for (let i in liste) {
          try {
            let resultsFirstFetch = await getWeatherNextDays(
              [liste[i]["Phase1"], liste[i]["Phase2"], liste[i]["Phase3"]],
              liste[i]["nx"],
              liste[i]["ny"],
            );
            setHighestNextDays((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter(
                      (x) => x.category === "TMN" || x.category === "TMX",
                    )
                  : [],
            }));
            setSkyNextDays((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "SKY")
                  : [],
            }));
            setRainNextDays((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "PTY")
                  : [],
            }));
            setTempNextDays((prev) => ({
              ...prev,
              [`${liste[i]["Phase2"]} - ${liste[i]["Phase3"]}`]:
                resultsFirstFetch
                  ? resultsFirstFetch.filter((x) => x.category === "TMP")
                  : [],
            }));
          } catch (error) {
            window.console.log(error);
            setisForecasted(false);
            return Promise.reject(error);
          }
        }
      };
      Promise.all([saveDataNow(), saveDataForecast(), saveDataNextDays()])
        .then(() => {
          window.console.log("List recover sucess");
          setIsFetch(true);
          setIsLoaded(true);
          setIsLoadedForecast(true);
          setisForecasted(true);
          setCanRefresh(true);
        })
        .catch((e) => {
          window.console.log(`List recover fail: ${e}`);
          setCanRefresh(true);
        });
    }
    return () => {
      setIsFetch(false);
      setIsLoaded(false);
      setIsLoadedForecast(false);
      setisForecasted(false);
      setCanRefresh(false);
    };
  }, [listSaved, refreshFetch]);

  return {
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
    canRefersh,
  };
}
