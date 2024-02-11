import { useEffect, useState } from "react";
import { animated } from "react-spring";

export default function WeatherParticle(props) {
  const {
    pm10,
    setpm10,
    pm25,
    setpm25,
    globalindex,
    setglobalindex,
    isdusted,
    setisdusted,
    springanimation,
  } = props;

  const dustGrade = [
    { grade: 0 },
    {
      grade: 1,
      color: "text-blue-500",
      bgcolor: "bg-blue-500",
      border: [
        "border-l-blue-500 border-t-blue-500",
        "border-r-blue-500 border-b-blue-500",
      ],
      name: "좋음",
    },
    {
      grade: 2,
      color: "text-green-500",
      bgcolor: "bg-green-500",
      border: [
        "border-l-green-500 border-t-green-500",
        "border-r-green-500 border-b-green-500",
      ],
      name: "보통",
    },
    {
      grade: 3,
      color: "text-orange-400",
      bgcolor: "bg-orange-500",
      border: [
        "border-l-orange-500 border-t-orange-500",
        "border-r-orange-500 border-b-orange-500",
      ],
      name: "나쁨",
    },
    {
      grade: 4,
      color: "text-red-500",
      bgcolor: "bg-red-500",
      border: [
        "border-l-red-500 border-t-red-500",
        "border-r-red-500 border-b-red-500",
      ],
      name: "매우나쁨",
    },
  ];

  return (
    <animated.div
      style={springanimation ? { ...springanimation } : {}}
      className={`inline-flex h-fit w-full justify-end`}
    >
      <div
        className={`${
          pm10.flag !== null || !pm10
            ? "border-red-600"
            : dustGrade[pm10.grade].border[0]
        } m-2 flex flex-col gap-2 rounded-2xl border-4 border-solid border-transparent bg-white bg-opacity-40 p-2 text-sm`}
      >
        <div className="flex flex-row items-center gap-2">
          <p
            className={`${
              pm10.flag !== null || !pm10
                ? "text-red-600"
                : dustGrade[pm10.grade].color
            } text-xl`}
          >
            미세먼지
          </p>
          <p className="text-xs">{pm10.station}</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 ">
          {!pm10.flag && (
            <>
              <p
                className={`${
                  pm10.flag !== null || !pm10
                    ? "text-red-600"
                    : dustGrade[pm10.grade].color
                } text-xl`}
              >
                {dustGrade[pm10.grade].name}
              </p>
              <p className="whitespace-pre">
                ( {pm10.value} ㎍/m<sup>3</sup>)
              </p>
            </>
          )}
          {pm10.flag && <p className="text-xl">오류: {pm10.flag}</p>}
        </div>
      </div>

      <div
        className={`${
          pm25.flag !== null || !pm25
            ? "border-red-600"
            : dustGrade[pm25.grade].border[1]
        } m-2 flex flex-col gap-2 rounded-2xl border-4 border-solid border-transparent bg-white bg-opacity-40 p-2 text-sm`}
      >
        <div className="flex flex-row items-center gap-2">
          <p
            className={`${
              pm25.flag !== null || !pm25
                ? "text-red-600"
                : dustGrade[pm25.grade].color
            } text-xl`}
          >
            초미세먼지
          </p>
          <p className="text-xs">{pm25.station}</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          {!pm25.flag && (
            <>
              <p
                className={`${
                  pm25.flag !== null || !pm25
                    ? "text-red-600"
                    : dustGrade[pm25.grade].color
                } text-xl`}
              >
                {dustGrade[pm25.grade].name}
              </p>
              <p className="whitespace-pre">
                ( {pm25.value} ㎍/m<sup>3</sup>)
              </p>
            </>
          )}
          {pm25.flag && <p className="text-xl">오류: {pm25.flag}</p>}
        </div>
      </div>
    </animated.div>
  );
}
