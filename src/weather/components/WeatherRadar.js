import { useContext, useEffect, useRef, useState } from "react";
import { QueryContext } from "../../App";

export default function WeatherRadar(props) {
  const { radar, setradar } = props;
  const { baseTime, baseDate } = useContext(QueryContext);

  const [imgSrc, setImgSrc] = useState(0);

  useEffect(() => {
    console.log(baseTime);
    console.log(radar.length);
    console.log(radar[0]);
  }, []);

  useEffect(() => {
    let counter = 0;
    const timer = setInterval(() => {
      if (radar[counter + 1]) {
        setImgSrc((prev) => prev + 1);
        counter += 1;
      }
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="h-fit w-fit bg-red-200"
      onClick={() => {
        setImgSrc((prev) => prev + 1);
      }}
    >
      <div>
        <p className="font-bold">Test</p>
        <p className="font-bold">{imgSrc}</p>
        <img className="h-[400px] w-[400px]" src={radar[imgSrc]}></img>
      </div>
    </div>
  );
}
