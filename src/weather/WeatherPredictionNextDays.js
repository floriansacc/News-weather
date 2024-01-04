import { useContext } from "react";
import { QueryContext } from "../App";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function WeatherPredictionNextDays(props) {
  const { tempnextdays, resizew } = props;
  const { images, baseDate, tomorrowDate, afterTomorrowDate } =
    useContext(QueryContext);

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
        backgroundColor: "#974ee7",
        borderColor: "#974ee7",
        tension: 0.2,
      },
      {
        label: "after tomorrow",
        data: tempnextdays
          .filter((y) => y.date === afterTomorrowDate)
          .map((x, i) => x.value),
        backgroundColor: "red",
        borderColor: "red",
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
        },
        grid: {
          drawBorder: true,
          display: true,
          drawTicks: true,
        },
        border: {
          display: false,
        },

        min: Math.min(...tempnextdays.map((x, i) => x.value)) - 2,
        max: Math.max(...tempnextdays.map((x, i) => x.value)) + 2,
      },
    },
  };

  /**
    {tempnextdays.slice(1, 23).map((x, i) => (
            <ul
              className="flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl px-3"
              key={`ulNo${i}`}
            >
              <li className="text-xl" key={`li1no${i}`}>
                {x.value}°
              </li>
            </ul>
          ))}
   */

  return (
    <div className="relative m-2 mt-1 w-11/12 self-center overflow-auto rounded-2xl border-2 border-solid border-red-500 border-transparent bg-white bg-opacity-25 p-2 scrollbar-hide">
      <div className="flex w-fit flex-col items-center justify-center overflow-x-scroll scrollbar-hide">
        <div className={`mx-0 flex h-20 w-[97%] justify-start`}>
          <Line options={options} data={data} />
        </div>
        <div className="flex w-full flex-row flex-nowrap justify-between pl-3">
          {tempnextdays
            .filter((y) => y.date === tomorrowDate)
            .map((x, i) => (
              <ul
                className="mx-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
                key={`ulNo${i}`}
              >
                <li className="mb-1 text-base" key={`li2no${i}`}>
                  {x.time.slice(0, 2)}h
                </li>
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
}
