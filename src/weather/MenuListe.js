import { useState } from "react";

export default function MenuListe(props) {
  const {
    addtolist,
    mouseenter,
    mouseleave,
    fetchcheck,
    elem,
    liste,
    dataimport,
    cityselector,
    resetlist,
    weatherslide,
    menuliston,
    setmenuliston,
  } = props;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const toStyleDisplayDescription = {
    left: mousePosition.x,
    top: mousePosition.y + 15,
  };

  /*const handleCommand = () => {
    window.console.log("MAP");
    window.console.log(weatherInfoNow);
    window.console.log("MAP2");
    window.console.log(weatherForecast);
    window.console.log(skyForecast);
    window.console.log(tempForecast);
    window.console.log(liste.length);
  };*/

  const handleDisplayDescription = (e) => {
    document.getElementById("displaydescription").style.display =
      fetchcheck[0] && fetchcheck[1] ? "none" : "block";
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDisplayMouseLeave = (e) => {
    document.getElementById("displaydescription").style.display = "none";
  };

  return (
    <div
      className={`mt-2 h-full w-11/12 flex-col items-start justify-start rounded-xl p-1 ${
        menuliston ? "flex" : "hidden"
      }`}
    >
      <div className="flex w-full flex-row flex-nowrap items-center justify-center rounded-xl border border-black">
        <div className="m-1 flex flex-col flex-nowrap items-center">
          <button
            className="m-1.5 flex h-fit items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5"
            onClick={addtolist}
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
          >
            Add to my list
          </button>
          <button
            className={`m-1.5 flex h-fit items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5
        ${
          fetchcheck[0] && fetchcheck[1]
            ? "brightness-100"
            : fetchcheck[2]
              ? "brightness-100"
              : "brightness-75"
        }`}
            onMouseEnter={fetchcheck[0] && fetchcheck[1] ? mouseenter : null}
            onMouseLeave={
              fetchcheck[0] && fetchcheck[1]
                ? mouseleave
                : handleDisplayMouseLeave
            }
            onMouseMove={handleDisplayDescription}
            onClick={
              fetchcheck[2]
                ? resetlist
                : fetchcheck[0] && fetchcheck[1]
                  ? weatherslide
                  : null
            }
            id="Displaybutton"
          >
            Display Weather
          </button>
        </div>
        <div>
          <label className="flex flex-col flex-nowrap">
            <select
              className="m-1 w-36 rounded-xl border-2 border-gray-300 bg-inherit px-1"
              name="one"
              value={elem[0]}
              onChange={cityselector}
            >
              <option name="one" value="선택" label="선택"></option>
              {Array.from(new Set(dataimport.map((obj) => obj.Part1))).map(
                (x, i) => {
                  return (
                    <option
                      name="one"
                      value={x}
                      label={x}
                      key={`optionlist1${i}`}
                    ></option>
                  );
                },
              )}
            </select>
            <select
              className="m-1 w-36 rounded-xl border-2 border-gray-300 bg-inherit px-1"
              name="two"
              value={elem[1]}
              onChange={cityselector}
            >
              {Array.from(
                new Set(
                  dataimport
                    .filter((word) => word.Part1 === elem[0])
                    .map((obj) => obj.Part2),
                ),
              ).map((x, i) => {
                return (
                  <option
                    name="two"
                    value={x}
                    label={x}
                    key={`optionlist2${i}`}
                  ></option>
                );
              })}
            </select>
            <select
              className="m-1 w-36 rounded-xl border-2 border-gray-300 bg-inherit px-1"
              name="three"
              value={elem[2]}
              onChange={cityselector}
            >
              {Array.from(
                new Set(
                  dataimport
                    .filter(
                      (word) =>
                        word.Part2 === elem[1] && word.Part1 === elem[0],
                    )
                    .map((obj) => obj),
                ),
              ).map((x, i) => {
                return (
                  <option
                    name="three"
                    value={x.Part3}
                    label={x.Part3}
                    key={`optionlist3${i}`}
                  ></option>
                );
              })}
            </select>
          </label>
        </div>
        <div className="flex w-fit flex-col flex-nowrap items-center">
          <p
            style={toStyleDisplayDescription}
            className="absolute hidden h-fit w-fit rounded-3xl border border-solid border-black bg-white px-2 py-1 text-white"
            id="displaydescription"
          >
            Need to fill the list before display
          </p>
          <button
            className="m-1.5 flex h-8 items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5"
            onClick={resetlist}
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
          >
            Reset
          </button>
          <button
            className="m-1.5 hidden h-8 items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5"
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
          >
            Console
          </button>
        </div>
      </div>
      {liste[0] && <p className="mt-6">List of city to display:</p>}
      <div
        className={`${
          liste[0] ? "grid" : "hidden"
        }  my-4 w-full auto-rows-t1 grid-cols-3 justify-items-center rounded-xl border border-solid border-black`}
      >
        {liste[0] && (
          <>
            <p className="my-1 font-semibold">1단계</p>
            <p className="my-1 font-semibold">2단계</p>
            <p className="my-1 font-semibold">3단계</p>
          </>
        )}
        {liste.map((x, i) => (
          <>
            <p className="min-w-33 text-center" key={`p1${i}`}>
              {x.Phase1}
            </p>
            <p className="min-w-33 text-center" key={`p2${i}`}>
              {x.Phase2}
            </p>
            <p className="w-fit min-w-25 text-center" key={`p3${i}`}>
              {x.Phase3}
            </p>
          </>
        ))}
      </div>
    </div>
  );
}
