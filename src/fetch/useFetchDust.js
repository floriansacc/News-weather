import { useEffect, useState } from "react";

export default function useFetchDust(city, isLocated, refreshFetch) {
  const [pm10, setPm10] = useState({});
  const [pm25, setPm25] = useState({});
  const [globalIndex, setGlobalIndex] = useState({});
  const [isDusted, setIsDusted] = useState(false);

  const serviceKey = process.env.REACT_APP_DUST_KEY;

  const cityDustUrl =
    "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";

  const x =
    "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?serviceKey=서비스키&returnType=json&tmX=317994.49&tmY=4160810.57";

  const test =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=서비스키&returnType=json&numofRows=100&pageNo=1&sidoName=서울";

  useEffect(() => {
    const abortController = new AbortController();
    const getDustStation = async () => {
      let temporary = [];
      const urlDust = `${cityDustUrl}?serviceKey=xxxx&returnType=json&numofRows=100&pageNo=1&sidoName=서울&ver=1.3`;
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
        window.console.log(jsonResponse.response.body.items[0]);
        await jsonResponse.response.body.items.forEach((x, i) => {
          if (i === 0) {
            setPm10({
              value: x.pm10Value,
              grade: x.pm10Grade1h,
              city: x.sidoName,
              station: x.stationName,
              time: x.dateTime,
            });
            setPm25({
              value: x.pm25Value,
              grade: x.pm25Grade1h,
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
          await getDustStation();
          setIsDusted(true);
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
