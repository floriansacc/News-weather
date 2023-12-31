import { useContext } from "react";
import { QueryContext } from "../App";

export default function WeatherLongTerm(props) {
  const { highestnextday, tempnextdays, skynextdays, isforecasted } = props;
  const { images, tomorrowDate, afterTomorrowDate } = useContext(QueryContext);

  //TMX: 최고기온
  //TMN: 최저기온

  const arrayToMap = [
    {
      set: "tomorrow",
      highest: highestnextday.filter((y) => y.category === "TMX")[0],
      lowest: highestnextday.filter((y) => y.category === "TMN")[0],
      sky: [
        skynextdays.filter((y) => y.category === "SKY")[0],
        skynextdays.filter((y) => y.category === "SKY")[1],
      ],
      rain: [
        skynextdays.filter((y) => y.category === "PTY")[0],
        skynextdays.filter((y) => y.category === "PTY")[1],
      ],
    },
    {
      set: "D+2",
      highest: highestnextday.filter((y) => y.category === "TMX")[1],
      lowest: highestnextday.filter((y) => y.category === "TMN")[1],
      sky: [
        skynextdays.filter((y) => y.category === "SKY")[2],
        skynextdays.filter((y) => y.category === "SKY")[3],
      ],
      rain: [
        skynextdays.filter((y) => y.category === "PTY")[2],
        skynextdays.filter((y) => y.category === "PTY")[3],
      ],
    },
  ];
  return (
    <div className="mx-2 flex w-full rounded-2xl border border-solid border-transparent bg-white bg-opacity-25 py-2">
      {isforecasted &&
        arrayToMap.map((x, i) => (
          <ul className="mx-3 flex h-fit w-2/12 min-w-fit flex-col items-center justify-center rounded-2xl bg-white bg-opacity-10">
            <li className="mb-0 self-start px-2">{x.set}</li>
            <div className="flex w-full items-center justify-around p-1">
              {x.rain.map((y, j) => (
                <div className="flex flex-col items-center justify-center">
                  <p>{j === 0 ? "am" : "pm"}</p>
                  <img
                    src={
                      images[
                        y.value === "1"
                          ? 4
                          : y.value === "2"
                            ? 5
                            : y.value === "3"
                              ? 5
                              : y.value === "5"
                                ? 4
                                : `${x.sky[j].value - 1}`
                      ]
                    }
                    className="m-1 h-7 w-auto"
                    key={`image${x.value}${i}`}
                  ></img>
                </div>
              ))}
            </div>
            <div className="rounded-b-2x relative flex w-full items-center justify-center">
              <li className="text-2xl  text-blue-700">{x.lowest.value}</li>
              <li className="text-2xl  text-black">/</li>
              <li className="text-2xl text-red-700">{x.highest.value}</li>
            </div>
          </ul>
        ))}
    </div>
  );
}
