import { useEffect } from "react";

export default function useFetchDust(props) {
  const serviceKey = process.env.REACT_APP_DUST_KEY;

  const dustStationUrl =
    "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList";

  const x =
    "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?serviceKey=서비스키&returnType=json&tmX=317994.49&tmY=4160810.57";

  const test =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=서비스키&returnType=json&numofRows=100&pageNo=1&sidoName=서울";

  useEffect(() => {
    const abortController = new AbortController();
    const getDustStation = async () => {
      let temporary = [];
      const urlDust = test;
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
        window.console.log("dust fetch");
        window.console.log(jsonResponse.response.body.items);
      } catch (error) {
        console.log(`Premier fetch error: ${error}`);
      }
    };
    getDustStation();
  }, []);

  return { x };
}
