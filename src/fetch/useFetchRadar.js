import { useContext, useEffect, useState } from "react";
import { QueryContext } from "../App";

export default function useFetchRadar(refreshFetch) {
  const { baseDate } = useContext(QueryContext);
  const [radar, setRadar] = useState();
  const [isRadarOk, setIsRadarOk] = useState(false);

  const radarUrl =
    "https://apis.data.go.kr/1360000/RadarImgInfoService/getCmpImg";

  const serviceKey = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    const abortController = new AbortController();
    const getRadar = async () => {
      const getUrlRadar = `${radarUrl}?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=JSON&data=CMP_WRC&time=${baseDate}`;
      try {
        const response = await fetch(getUrlRadar, {
          signal: abortController.signal,
          headers: {
            Accept: "application / json",
          },
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Pas de radar pour toi");
        }
        const jsponResponse = await response.json();
        window.console.log([
          `Radar`,
          jsponResponse.response.header["resultMsg"],
        ]);
        window.console.log(jsponResponse.response.body.items.item);
        setRadar(
          jsponResponse.response.body.items.item[0]["rdr-img-file"]
            .replace("[", "")
            .replace("]", "")
            .split(","),
        );
      } catch (error) {
        window.console.log(error);
      }
    };
    let fetchRadar = async () => {
      try {
        await getRadar();
        setIsRadarOk(true);
      } catch (e) {
        window.console.log(e);
        setIsRadarOk(false);
      }
    };
    fetchRadar();
    return () => {
      abortController.abort();
      setRadar();
      setIsRadarOk(false);
    };
  }, [refreshFetch]);

  return {
    radar,
    setRadar,
    isRadarOk,
    setIsRadarOk,
  };
}
