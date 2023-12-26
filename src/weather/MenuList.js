import { useState, useEffect, useContext } from "react";
import ButtonOpenClose from "./ButtonOpenClose";
import { QueryContext } from "../GlobalBody";

export default function MenuList(props) {
  const {
    addtolist,
    mouseenter,
    mouseleave,
    fetchcheck,
    elem,
    liste,
    cityselector,
    resetlist,
    weatherslide,
  } = props;
  const { dataimport, menuListOn, setMenuListOn } = useContext(QueryContext);

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

  useEffect(() => {
    if (menuListOn) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
  }, [menuListOn]);

  return (
    <div
      className={`fixed left-[50%] top-[50%] z-50 flex w-10/12 -translate-x-[50%] flex-col items-center justify-center rounded-xl bg-slate-200 p-2 transition-all duration-500 ${
        menuListOn ? "-translate-y-[50%]  shadow-dim" : "-translate-y-[-60vh]"
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
            className="m-1.5 flex h-fit items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5"
            onClick={resetlist}
            onMouseEnter={mouseenter}
            onMouseLeave={mouseleave}
            id="resetbutton"
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
      <p className="mt-6">List of city to display:</p>
      <div
        className={`my-4 grid w-full auto-rows-t1 grid-cols-3 justify-items-center rounded-xl border border-solid border-black`}
      >
        <p className="my-1 font-semibold">1단계</p>
        <p className="my-1 font-semibold">2단계</p>
        <p className="my-1 font-semibold">3단계</p>
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
      <button
        className={`m-1.5 flex h-fit items-center rounded-full border-2 border-gray-400 bg-gradient-to-r from-gray-300 to-gray-400 p-1.5
        ${fetchcheck[0] && fetchcheck[1] ? "brightness-100" : "brightness-75"}`}
        onMouseEnter={fetchcheck[0] && fetchcheck[1] ? mouseenter : null}
        onMouseLeave={
          fetchcheck[0] && fetchcheck[1] ? mouseleave : handleDisplayMouseLeave
        }
        onMouseMove={handleDisplayDescription}
        onClick={fetchcheck[0] && fetchcheck[1] ? weatherslide : null}
        id="Displaybutton"
      >
        Display Weather
      </button>
      <ButtonOpenClose
        menuListOn={menuListOn}
        setMenuListOn={setMenuListOn}
        foropen={true}
      />
    </div>
  );
}
