import { useEffect, useState } from "react";

export default function useFetchParticle(city, isLocated, refreshFetch) {
  const [pm10, setPm10] = useState({});
  const [pm25, setPm25] = useState({});
  const [globalIndex, setGlobalIndex] = useState({});
  const [isDusted, setIsDusted] = useState(false);

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  const cityDustUrl =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

  useEffect(() => {
    const abortController = new AbortController();
    const getDustStation = async () => {
      const urlDust = `${cityDustUrl}?serviceKey=${serviceKey}&returnType=json&stationName=${city[5]}&dataTerm=DAILY&ver=1.5`;
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
            setPm10({
              value: parseInt(x.pm10Value),
              grade: parseInt(x.pm10Grade1h),
              city: x.sidoName,
              station: x.stationName,
              time: x.dateTime,
            });
            setPm25({
              value: parseInt(x.pm25Value),
              grade: parseInt(x.pm25Grade1h),
              city: x.sidoName,
              station: x.stationName,
              time: x.dateTime,
            });
          }
        });
      } catch (error) {
        console.log(`Dust fetch error: ${error}`);
      }
    };
    if (isLocated) {
      let fetchAll = async () => {
        try {
          await getDustStation().then(() => setIsDusted(true));
        } catch (e) {
          window.console.log(e);
          setIsDusted(false);
        }
      };
      fetchAll();
    }
    return () => {
      abortController.abort();
      setIsDusted(false);
    };
  }, [isLocated, refreshFetch]);

  return {
    pm10,
    setPm10,
    pm25,
    setPm25,
    globalIndex,
    setGlobalIndex,
    isDusted,
    setIsDusted,
  };
}
