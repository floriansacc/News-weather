import { useContext } from "react";
import { QueryContext } from "../../layout/RootLayout";
import WeatherPredictionNextDays from "./WeatherPredictionNextDays";
import { animated } from "react-spring";

export default function WeatherLongTerm(props) {
  const {
    highestnextdays,
    tempnextdays,
    skynextdays,
    rainnextdays,
    isforecasted,
    springanimation,
  } = props;
  const { images } = useContext(QueryContext);

  //TMX: 최고기온
  //TMN: 최저기온

  const arrayToMap = [
    {
      set: "내일",
      color: "#218fff",
      highest: highestnextdays.filter((y) => y.category === "TMX")[0],
      lowest: highestnextdays.filter((y) => y.category === "TMN")[0],
      sky: [
        skynextdays.filter((y) => y.category === "SKY" && y.time === "0600")[0],
        skynextdays.filter((y) => y.category === "SKY" && y.time === "1500")[0],
      ],
      rain: [
        rainnextdays.filter(
          (y) => y.category === "PTY" && y.time === "0600",
        )[0],
        rainnextdays.filter(
          (y) => y.category === "PTY" && y.time === "1500",
        )[0],
      ],
    },
    {
      set: "모레",
      color: "#974ee7",
      highest: highestnextdays.filter((y) => y.category === "TMX")[1],
      lowest: highestnextdays.filter((y) => y.category === "TMN")[1],
      sky: [
        skynextdays.filter((y) => y.category === "SKY" && y.time === "0600")[1],
        skynextdays.filter((y) => y.category === "SKY" && y.time === "1500")[1],
      ],
      rain: [
        rainnextdays.filter(
          (y) => y.category === "PTY" && y.time === "0600",
        )[1],
        rainnextdays.filter(
          (y) => y.category === "PTY" && y.time === "1500",
        )[1],
      ],
    },
  ];

  return (
    <animated.div
      style={springanimation ? { ...springanimation } : {}}
      className="m-2 mt-0 flex h-fit w-full flex-wrap self-center rounded-2xl border-2 border-solid border-transparent bg-white bg-opacity-25 p-2"
    >
      {arrayToMap.map((x, i) => (
        <ul
          className="mx-1 flex h-fit w-fit min-w-fit flex-col items-center justify-center rounded-2xl bg-white bg-opacity-10"
          key={`ul${x.Phase3}${i}`}
        >
          <li
            style={{ color: `${x.color}` }}
            className={`mb-0 self-start px-2 font-bold`}
            key={`${x.color}${i}`}
          >
            {x.set}
          </li>
          <div
            className="flex w-full items-center justify-around p-1"
            key={`div long term ${x.Phase3}${i}`}
          >
            {x.rain.map((y, j) => (
              <div
                className="flex flex-col items-center justify-center"
                key={`${x.rain}${i}${j}`}
              >
                <p key={`${x.set}${j}`}>{j === 0 ? "오전" : "오후"}</p>
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
                  className="m-1 h-6 w-auto"
                  key={`image${x.value}${i}`}
                ></img>
              </div>
            ))}
          </div>
          <div
            className="rounded-b-2x relative flex w-full items-center justify-center px-2"
            key={`div for lowest ${x.Phase3}${i}`}
          >
            <li
              className="text-2xl text-blue-500"
              key={`${x.lowest.value}${i}${x.Phase3}`}
            >
              {x.lowest.value}
            </li>
            <li className="text-2xl text-black" key={`middle${i}${x.Phase3}`}>
              /
            </li>
            <li
              className="text-2xl text-red-500"
              key={`${x.highest.value}${i}${x.Phase3}`}
            >
              {x.highest.value}
            </li>
          </div>
        </ul>
      ))}
      <WeatherPredictionNextDays
        isforecasted={isforecasted}
        tempnextdays={tempnextdays}
        rainnextdays={rainnextdays}
        skynextdays={skynextdays}
      />
    </animated.div>
  );
}
