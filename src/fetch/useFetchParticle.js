import { useEffect, useState } from "react";

export default function useFetchParticle(city, isLocated, refreshFetch) {
  const [pm10, setPm10] = useState({});
  const [pm25, setPm25] = useState({});
  const [globalIndex, setGlobalIndex] = useState({});
  const [isDusted, setIsDusted] = useState(false);
  const [cityTracker, setCityTracker] = useState("서울");

  const serviceKey = process.env.REACT_APP_DUST_KEY;

  const getCity = (x) => {
    if (x === "전라북도") {
      return "전북";
    } else if (x === "전라남도") {
      return "전남";
    } else if (x === "전라남도") {
      return "전남";
    } else if (x === "경상북도") {
      return "경북";
    } else if (x === "겅상남도") {
      return "경남";
    } else if (x === "충청북도") {
      return "충북";
    } else if (x === "충청남도") {
      return "충남";
    } else {
      return x.slice(0, 2);
    }
  };

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
      const urlDust = `${cityDustUrl}?serviceKey=${serviceKey}&returnType=json&numofRows=100&pageNo=1&sidoName=${getCity(
        city[0],
      )}&ver=1.3`;
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
        window.console.log([
          `Particle fetch${city[0]}`,
          jsonResponse.response.header["resultMsg"],
        ]);
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
