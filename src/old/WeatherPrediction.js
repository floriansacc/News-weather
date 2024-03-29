import { useContext } from "react";
import { QueryContext } from "../App";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function WeatherPrediction(props) {
  const { skyforecast, tempforecast, rainforecast } = props;
  const { images } = useContext(QueryContext);

  const data = {
    labels: tempforecast.slice(1, 6).map((x, i) => x.time.slice(0, 2)),
    datasets: [
      {
        label: "온도",
        data: tempforecast.slice(1, 6).map((x, i) => x.value),
        backgroundColor: "#974ee7",
        borderColor: "#974ee7",
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
  };

  return (
    <div className="border-1 w-full rounded-2xl border-solid border-transparent bg-white bg-opacity-25">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-full flex-row flex-nowrap justify-between">
          {tempforecast.slice(1, 6).map((x, i) => (
            <ul
              className="mx-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
              key={`ulNo${i}`}
            >
              <img
                src={
                  images[
                    rainforecast[i + 1].value === "1"
                      ? 4
                      : rainforecast[i + 1].value === "2"
                        ? 5
                        : rainforecast[i + 1].value === "3"
                          ? 5
                          : rainforecast[i + 1].value === "5"
                            ? 4
                            : `${skyforecast[i + 1].value - 1}`
                  ]
                }
                className="h-7 w-auto"
                key={`image${x.value}${i}`}
              ></img>
              <li className="text-xl" key={`li1no${i}`}>
                {x.value}°
              </li>
            </ul>
          ))}
        </div>
        <div className="mx-10 hidden h-16 w-10/12">
          <Line style={styleChart} options={options} data={data} />
        </div>
        <div className="flex w-full flex-row flex-nowrap justify-between">
          {tempforecast.slice(1, 6).map((x, i) => (
            <ul
              className="mx-3 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
              key={`ulNo${i}`}
            >
              <li className="mb-1 text-base" key={`li2no${i}`}>
                {x.time.slice(0, 2)}시
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
