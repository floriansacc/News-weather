import { useEffect, useState } from "react";

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
  } = props;

  const [bg, setBg] = useState({ pm10: null, pm25: null });

  const dustGrade = [
    { grade: 0 },
    { grade: 1, color: "bg-blue-500", name: "좋음" },
    { grade: 2, color: "bg-green-500", name: "보통" },
    { grade: 3, color: "bg-orange-500", name: "나쁨" },
    { grade: 4, color: "bg-red-500", name: "매우나쁨" },
  ];

  return (
    <div className={`inline-flex h-fit w-full justify-end`}>
      <div
        className={`${
          !pm10 ? "" : dustGrade[pm10.grade].color
        } m-2 flex flex-col p-1`}
      >
        <p>
          미세먼지: {pm10.value} ㎍/m<sup>3</sup>
        </p>
        <div className="flex flex-row">
          <p className="pl-2">{dustGrade[pm10.grade].name}</p>
          <p className="pl-2">({pm10.city},</p>
          <p className="whitespace-pre pr-2"> {pm10.station})</p>
        </div>
      </div>
      <div
        className={`${
          !pm25 ? "" : dustGrade[pm25.grade].color
        } m-2 flex flex-col p-1`}
      >
        <p>
          초미세먼지: {pm25.value}㎍/m<sup>3</sup>
        </p>
        <div className="flex flex-row">
          <p className="pl-2">{dustGrade[pm25.grade].name}</p>
          <p className="pl-2">({pm25.city},</p>
          <p className="whitespace-pre pr-2"> {pm25.station})</p>
        </div>
      </div>
    </div>
  );
}
