import { useState, useContext, useEffect } from "react";
import { QueryContext } from "../App";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function WeatherPredictionNextDays(props) {
  const { tempnextdays } = props;
  const { tomorrowDate, afterTomorrowDate } = useContext(QueryContext);
  const [startX, setStartX] = useState(null);
  const [toTranslate, setToTranslate] = useState(null);
  const [isDragging, setIsDragging] = useState(null);

  const setMinMax = () => {
    let min = Math.min(
      ...tempnextdays
        .filter((y) => y.date === tomorrowDate || y.date === afterTomorrowDate)
        .map((x, i) => x.value),
    );
    let max = Math.max(
      ...tempnextdays
        .filter((y) => y.date === tomorrowDate || y.date === afterTomorrowDate)
        .map((x, i) => x.value),
    );
    if (min % 2 === 0) {
      min -= 2;
    } else {
      min -= 3;
    }
    if (max % 2 === 0) {
      max += 2;
    } else {
      max += 3;
    }
    return { min, max };
  };

  const data = {
    labels: tempnextdays
      .filter((y) => y.date === afterTomorrowDate)
      .map((x, i) => `${x.time.slice(0, 2)}h`),
    datasets: [
      {
        label: "tomorrow",
        data: tempnextdays
          .filter((y) => y.date === tomorrowDate)
          .map((x, i) => x.value),
        backgroundColor: "#218fff",
        borderColor: "#218fff",
        tension: 0.2,
      },
      {
        label: "after tomorrow",
        data: tempnextdays
          .filter((y) => y.date === afterTomorrowDate)
          .map((x, i) => x.value),
        backgroundColor: "#974ee7",
        borderColor: "#974ee7",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "chartArea",
        align: "center",
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
          padding: 0,
          font: {
            size: 16,
          },
          color: "#000",
        },
        grid: {
          drawBorder: true,
          display: true,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: true,
          padding: 0,
          color: "#000",
          stepSize: 2,
          precision: true,
          autoSkip: false,
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },
        },
        grid: {
          drawBorder: true,
          display: true,
          drawTicks: true,
          color: ({ tick }) =>
            tick.value === 0 ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)",
        },
        border: {
          display: false,
        },

        min: setMinMax().min,
        max: setMinMax().max,
      },
    },
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX - toTranslate);
    setIsDragging(true);
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newTranslate = e.clientX - startX;
      setToTranslate(newTranslate);
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    if (
      -toTranslate >
      parseInt(e.target.style.width.slice(0, -2)) -
        document.getElementById("ref-width").offsetWidth +
        50
    ) {
      setToTranslate(
        -e.target.style.width.slice(0, -2) +
          document.getElementById("ref-width").offsetWidth -
          50,
      );
    } else if (-toTranslate < 0) {
      setToTranslate(0);
    }
  };

  return (
    <div
      className="relative z-20 mt-1 w-full self-center overflow-auto rounded-2xl border-2 border-solid border-red-500 border-transparent bg-white bg-opacity-25 scrollbar-hide"
      id="ref-width"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={`relative flex w-fit flex-col items-center justify-center overflow-x-scroll scrollbar-hide ${
          !isDragging ? "transition-all" : ""
        } `}
        style={{ transform: `translate3d(${toTranslate}px, 0, 0)` }}
      >
        <div className={`mx-0 flex h-28 w-[97%] justify-start`}>
          <Line options={options} data={data} id="next-day-graph" />
        </div>
        <div className="flex w-full flex-row flex-nowrap justify-between pl-3">
          {tempnextdays
            .filter((y) => y.date === tomorrowDate)
            .map((x, i) => (
              <ul
                className="mx-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
                key={`ulNo${i}`}
              >
                <li
                  className="mb-1 whitespace-nowrap text-base"
                  key={`li2no${i}`}
                >
                  {x.time.slice(0, 2)}시
                </li>
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
}
