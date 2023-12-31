import { useContext } from "react";
import { QueryContext } from "../App";

export default function WeatherCitySelector(props) {
  const { cityselector, handlecityselector } = props;
  const { dataimport } = useContext(QueryContext);
  return (
    <label className="flex h-fit w-fit flex-col flex-nowrap items-end justify-start">
      <select
        className="m-1 w-48 rounded-2xl bg-sky-100 bg-opacity-40 p-1"
        name="one"
        value={cityselector[0]}
        onChange={handlecityselector}
      >
        <option name="one" value="선택" label="선택"></option>
        {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map((x, i) => {
          return (
            <option name="one" value={x} label={x} key={`option1${i}`}></option>
          );
        })}
      </select>
      <div className="flex flex-nowrap">
        <select
          className="m-1 w-32 rounded-2xl bg-sky-100 bg-opacity-40 p-1"
          name="two"
          value={cityselector[1]}
          onChange={handlecityselector}
        >
          {Array.from(
            new Set(
              dataimport
                .filter((word) => word.Part1 === cityselector[0])
                .map((obj) => obj.Part2),
            ),
          ).map((x, i) => {
            return (
              <option
                name="two"
                value={x}
                label={x}
                key={`option2${i}`}
              ></option>
            );
          })}
        </select>
        <select
          className="m-1 w-32 rounded-2xl bg-sky-100 bg-opacity-40 p-1"
          name="three"
          value={cityselector[2]}
          onChange={handlecityselector}
        >
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
