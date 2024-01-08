import { useContext, useEffect, useRef } from "react";
import { QueryContext } from "../App";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function WeatherPrediction24(props) {
  const { tempnextdays, skynextdays, rainnextdays } = props;
  const { baseDate, images } = useContext(QueryContext);

  const chartRef = useRef(null);

  const setMinMax = () => {
    let min = Math.min(...tempnextdays.slice(1, 24).map((x) => x.value));
    let max = Math.max(...tempnextdays.slice(1, 24).map((x) => x.value));
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
    labels: tempnextdays.slice(1, 24).map((x, i) => `${x.time.slice(0, 2)}h`),
    datasets: [
      {
        label: "today",
        data: tempnextdays.slice(1, 24).map((x, i) => x.value),
        backgroundColor: "#974ee7",
        borderColor: "#218fff",
        tension: 0.3,
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
          display: false,
          drawBorder: true,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
          padding: 0,
          color: "#000",
          //stepSize: 2,
          precision: true,
          autoSkip: false,
          /*callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },*/
        },
        grid: {
          display: false,
          drawBorder: true,
          drawTicks: false,
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

  useEffect(() => {
    const chart = chartRef.current;

    /*if (chart) {
      console.log("CanvasRenderingContext2D", chart.ctx);
      console.log("HTMLCanvasElement", chart.canvas);
    }*/
  }, []);

  return (
    <div className="border-1 w-full items-center justify-center overflow-auto rounded-2xl border-solid border-transparent bg-white bg-opacity-25 scrollbar-hide">
      <div className="mx-4 flex w-fit flex-col items-center justify-center overflow-x-scroll scrollbar-hide">
        <div className="flex w-full flex-row flex-nowrap justify-between">
          {tempnextdays.slice(1, 24).map((x, i) => (
            <ul
              className="mx-2 mt-2 flex w-3/12 list-none flex-col flex-nowrap items-center justify-center rounded-xl"
              key={`ulNo${i}`}
            >
              <img
                src={
                  images[
                    rainnextdays[i + 1].value === "1"
                      ? 4
                      : rainnextdays[i + 1].value === "2"
                        ? 5
                        : rainnextdays[i + 1].value === "3"
                          ? 5
                          : rainnextdays[i + 1].value === "5"
                            ? 4
                            : `${skynextdays[i + 1].value - 1}`
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
        <div className={`mx-0 flex h-24 w-[97%] justify-center`}>
          <Line options={options} data={data} ref={chartRef} id="canvas" />
        </div>
        <div className="flex w-full flex-row flex-nowrap items-center justify-center">
          {tempnextdays.slice(1, 24).map((x, i) => (
            <ul
              className="mx-2 flex w-3/12 list-none flex-col flex-nowrap items-center rounded-xl"
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
