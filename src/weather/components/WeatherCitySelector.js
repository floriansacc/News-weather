import { useContext } from "react";
import { QueryContext } from "../../App";
import { IoSearchCircleOutline } from "react-icons/io5";

export default function WeatherCitySelector(props) {
  const { cityselector, handlecityselector } = props;
  const { dataimport, isDarkTheme } = useContext(QueryContext);

  const handleResearchCity = (e) => {};

  return (
    <label className="relative flex h-fit w-fit max-w-[18rem] flex-1 flex-col flex-nowrap items-end justify-start">
      <IoSearchCircleOutline
        className="absolute left-0 mt-1 h-8 w-8 cursor-pointer"
        onClick={handleResearchCity}
      />
      <select
        className="m-1 flex w-[75%] min-w-[6rem] flex-1 rounded-2xl bg-sky-100 bg-opacity-40 p-1 text-right"
        name="one"
        value={cityselector[0]}
        onChange={handlecityselector}
      >
        <option value="" disabled hidden>
          1
        </option>
        <option
          className={`${isDarkTheme ? "bg-[#202639]" : ""}`}
          name="one"
          value="선택"
          label="선택"
        ></option>
        {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map((x, i) => {
          return (
            <option
              className={`${isDarkTheme ? "bg-[#202639]" : ""}`}
              name="one"
              value={x}
              label={x}
              key={`option1${i}`}
            ></option>
          );
        })}
      </select>
      <div className="flex w-full flex-1 flex-nowrap justify-end">
        <select
          className="m-1 flex w-3/6 flex-1 rounded-2xl bg-sky-100 bg-opacity-40 p-1"
          name="two"
          value={cityselector[1]}
          onChange={handlecityselector}
        >
          <option value="" disabled hidden>
            2
          </option>
          {Array.from(
            new Set(
              dataimport
                .filter((word) => word.Part1 === cityselector[0])
                .map((obj) => obj.Part2),
            ),
          ).map((x, i) => {
            return (
              <option
                className={`${isDarkTheme ? "bg-[#202639]" : ""}`}
                name="two"
                value={x}
                label={x}
                key={`option2${i}`}
              ></option>
            );
          })}
        </select>
        <select
          className="m-1 flex w-3/6 flex-1 rounded-2xl bg-sky-100 bg-opacity-40 p-1"
          name="three"
          value={cityselector[2]}
          onChange={handlecityselector}
        >
          <option value="" disabled hidden>
            3
          </option>
          {Array.from(
            new Set(
              dataimport
                .filter(
                  (word) =>
                    word.Part2 === cityselector[1] &&
                    word.Part1 === cityselector[0],
                )
                .map((obj) => obj),
            ),
          ).map((x, i) => {
            return (
              <option
                className={`${isDarkTheme ? "bg-[#202639]" : ""}`}
                name="three"
                value={x.Part3}
                label={x.Part3}
                key={`option3${i}`}
              ></option>
            );
          })}
        </select>
      </div>
    </label>
  );
}
