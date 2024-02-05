import { useContext, useEffect, useState } from "react";
import { QueryContext } from "../App";

export default function useFetchPartRadar(isLocated, refreshFetch) {
  const { baseTimeDust } = useContext(QueryContext);

  const [radarDust10, setRadarDust10] = useState([]);
  const [radarDust25, setRadarDust25] = useState([]);
  const [radar25, setRadr25] = useState([]);
  const [isRadarDusted, setIsRadarDusted] = useState(false);

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  const cityDustUrl =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth";

  useEffect(() => {
    const abortController = new AbortController();
    let rightData;
    const getRadarDust = async () => {
      const urlDust = `${cityDustUrl}?serviceKey=${serviceKey}&returnType=json&numOfRows=1000&searchDate=${baseTimeDust}`;
      console.log(baseTimeDust);
      try {
        const response = await fetch(urlDust, {
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error fetch dust");
        }
        const jsonResponse = await response.json();
        await jsonResponse.response.body.items.forEach((x, i) => {
          if (i === 0) {
            rightData = x.dataTime;
          }
          if (
            x.informCode === "PM10" &&
            (x.imageUrl1 !== null || x.imageUrl4 !== null) &&
            x.dataTime === rightData
          ) {
            setRadarDust10((prev) => [
              ...prev,
              x.imageUrl1,
              x.imageUrl2,
              x.imageUrl3,
            ]);
          }
          if (
            x.informCode === "PM25" &&
            (x.imageUrl1 !== null || x.imageUrl4 !== null) &&
            x.dataTime === rightData
          ) {
            setRadarDust25((prev) => [
              ...prev,
              x.imageUrl4,
              x.imageUrl5,
              x.imageUrl6,
            ]);
          }
        });
      } catch (error) {
        console.log(`Dust fetch error: ${error}`);
      }
    };
    let fetchAll = async () => {
      try {
        await getRadarDust().then(() => {
          setIsRadarDusted(true);
        });
      } catch (e) {
        window.console.log(e);
        setIsRadarDusted(false);
      }
    };
    fetchAll();
    return () => {
      abortController.abort();
      setIsRadarDusted(false);
    };
  }, [refreshFetch]);

  return {
    radarDust10,
    setRadarDust10,
    radarDust25,
    setRadarDust25,
    isRadarDusted,
    setIsRadarDusted,
  };
}
