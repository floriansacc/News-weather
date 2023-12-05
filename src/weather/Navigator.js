import { useState } from "react";

export default function Navigator(props) {
  const { activetab, setactivetab } = props;
  const [menuOn, setMenuOn] = useState(false);

  const menu = ["Location", "My list"];

  const tabSelection = (e) => {
    if (e.target.innerHTML === menu[0]) {
      activetab === 0 ? setactivetab(2) : setactivetab(0);
      setMenuOn(false);
    } else if (e.target.innerHTML === menu[1]) {
      activetab === 1 ? setactivetab(2) : setactivetab(1);
      setMenuOn(false);
    }
  };

  return (
    <div>
      <button
        className="absolute z-40 top-5 left-10 bg-blue-400 p-2 rounded-md"
        onClick={() => setMenuOn(!menuOn)}
      >
        Menu
      </button>
      <div
        className={`absolute top-0 left-0 flex flex-col items-center z-30 overflow-hidden bg-red-300 h-screen transition-all duratio-300 ease-out ${
          menuOn ? `w-2/12 shadow-dim` : `w-0`
        }`}
      >
        <div className="mt-20 flex flex-col items-start">
          {menu.map((item, i) => (
            <a href={`#${item}`}>
              <p
                className={`relative my-5 p-3 w-full border border-solid border-cyan-500 rounded-xl ${
                  activetab === i
                    ? "bg-gradient-to-r from-gray-300 to-yellow-200"
                    : ""
                }`}
                onClick={tabSelection}
              >
                {item}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
