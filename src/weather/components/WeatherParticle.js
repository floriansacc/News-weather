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
    { grade: 1, color: "bg-blue-500", name: "좋음" },
    { grade: 2, color: "bg-green-500", name: "보통" },
    { grade: 3, color: "bg-orange-500", name: "나쁨" },
    { grade: 4, color: "bg-red-500", name: "매우나쁨" },
  ];

  return (
    <animated.div
      style={springanimation ? { ...springanimation } : {}}
      className={`inline-flex h-fit w-full justify-end`}
    >
      <div
        className={`${
          pm10.flag !== null || !pm10
            ? "bg-white/75 text-red-600"
            : dustGrade[pm10.grade].color
        } m-2 flex flex-col gap-2 rounded-2xl p-2 text-sm`}
      >
        <p>미세먼지 {pm10.station}</p>
        <div className="flex flex-row items-center justify-center gap-2 ">
          {!pm10.flag && (
            <>
              <p className="text-xl">{dustGrade[pm10.grade].name}</p>
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
            ? "bg-white/75 text-red-600"
            : dustGrade[pm25.grade].color
        } m-2 flex flex-col gap-2 rounded-2xl p-2 text-sm`}
      >
        <p>초미세먼지 {pm25.station}</p>

        <div className="flex flex-row items-center justify-center gap-2 ">
          {!pm25.flag && (
            <>
              <p className="text-xl">{dustGrade[pm25.grade].name}</p>
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
