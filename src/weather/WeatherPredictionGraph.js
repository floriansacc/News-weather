import { useContext } from "react";
import { QueryContext } from "../App";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function WeatherPredictionGraph(props) {
  const { tempnextdays, resizew } = props;
  const { images } = useContext(QueryContext);

  const data = {
    labels: tempnextdays.slice(1, 23).map((x, i) => x.time.slice(0, 2)),
    datasets: [
      {
        label: "온도",
        data: tempnextdays.slice(1, 23).map((x, i) => x.value),
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
      },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: {
          drawBorder: false,
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: { display: false },
        grid: {
          drawBorder: false,
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const styleChart = {
    height: "20px",
    overflow: "hidden",
  };
  window.console.log(resizew);

  return (
    <div className="border-1 m-2 mt-1 w-full overflow-x-scroll rounded-2xl border-solid border-transparent bg-white bg-opacity-25 p-2">
      <div className="flex w-fit flex-col items-center justify-center">
        <div className="flex w-full flex-row flex-nowrap justify-between">
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
        </div>
        <div className={`mx-5 h-16 w-[96%]`}>
          <Line style={styleChart} options={options} data={data} />
        </div>
        <div className="flex w-full flex-row flex-nowrap justify-between">
          {tempnextdays.slice(1, 23).map((x, i) => (
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
