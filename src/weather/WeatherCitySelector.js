export default function WeatherCitySelector(props) {
  const { dataimport, cityselector, handlecityselector } = props;

  return (
    <label className="flex flex-col flex-nowrap">
      <select
        className="w-32 bg-inherit m-1 border-2 border-gray-300 rounded-xl"
        name="one"
        value={cityselector[0]}
        onChange={handlecityselector}
      >
        <option name="one" value="선택" label="선택"></option>
        {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map((x) => {
          return <option name="one" value={x} label={x}></option>;
        })}
      </select>
      <select
        className="w-32 bg-inherit mb-1 border-2 border-gray-300 rounded-xl"
        name="two"
        value={cityselector[1]}
        onChange={handlecityselector}
      >
        {Array.from(
          new Set(
            dataimport
              .filter((word) => word.Part1 === cityselector[0])
              .map((obj) => obj.Part2)
          )
        ).map((x) => {
          return <option name="two" value={x} label={x}></option>;
        })}
      </select>
      <select
        className="w-32 bg-inherit mb-1 border-2 border-gray-300 rounded-xl"
        name="three"
        value={cityselector[2]}
        onChange={handlecityselector}
      >
        {Array.from(
          new Set(
            dataimport
              .filter((word) => word.Part2 === cityselector[1])
              .map((obj) => obj)
          )
        ).map((x) => {
          return <option name="three" value={x.Part3} label={x.Part3}></option>;
        })}
      </select>
    </label>
  );
}
