import { useContext } from "react";
import { QueryContext } from "../App";

export default function WeatherLongTerm(props) {
  const { tempnextday, temptwoday, isforecasted } = props;
  const { tomorrowDate, afterTomorrowDate } = useContext(QueryContext);

  //TMX: 최고기온
  //TMN: 최저기온

  const arrayToMap = [
    {
      set: "tomorrow",
      highest: tempnextday
        .filter((y) => y.category === "TMX")
        .map((x) => x.value)
        .slice(0, 1),
      lowest: tempnextday
        .filter((y) => y.category === "TMN")
        .map((x) => x.value)
        .slice(0, 1),
    },
    {
      set: "D+2",
      highest: tempnextday
        .filter((y) => y.category === "TMX")
        .map((x) => x.value)
        .slice(1, 2),
      lowest: tempnextday
        .filter((y) => y.category === "TMN")
        .map((x) => x.value)
        .slice(1, 2),
    },
  ];

  return (
    <div className="border-1 mx-2 flex w-full rounded-2xl border-solid border-transparent bg-white bg-opacity-25">
      {isforecasted &&
        arrayToMap.map((x, i) => (
          <ul className="mx-3 flex h-fit w-2/12 flex-col items-center justify-center rounded-2xl bg-red-200">
            <li className="mb-1 self-start px-2">{x.set}</li>
            <div className="relative flex w-full flex-col items-center justify-center bg-red-300">
              <li className="pr-10 text-3xl">{x.highest}</li>
              <li className="pl-10 text-2xl">{x.lowest}</li>
              <li className="absolute h-12 w-[0.8px] rotate-[35deg] rounded-3xl bg-gradient-to-tr from-gray-500 to-gray-900 text-4xl"></li>
            </div>
          </ul>
        ))}
    </div>
  );
}
