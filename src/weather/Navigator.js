import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Navigator(props) {
  const { activetab, setactivetab, menuon, setmenuon } = props;
  const [lastSession, setLastSession] = useState(
    sessionStorage.getItem("lastValue"),
  );
  const menu = ["Home", "Location", "My-list"];

  const tabSelection = (e) => {
    menu.forEach((x, i) => {
      if (e.target.innerHTML === menu[i]) {
        if (activetab !== i) {
          setactivetab(i);
          setmenuon(false);
          sessionStorage.setItem("lastValue", i);
        }
      }
    });
  };

  useEffect(() => {
    setactivetab(!lastSession ? "0" : parseInt(lastSession));
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-screen lg:sticky">
      <AiOutlineMenu
        className={`absolute left-7 top-5 z-40 h-10 w-10 rounded-xl border border-solid  bg-slate-200 p-2 transition-all duration-300 hover:animate-pulse  hover:bg-slate-300 lg:hidden ${
          menuon ? "-rotate-180" : ""
        } `}
        onClick={() => setmenuon(!menuon)}
      />

      <div
        className={`fixed left-0 top-0 z-30 flex h-full w-40 flex-col items-center overflow-hidden bg-green-600 bg-opacity-80 transition-transform duration-300 ease-out lg:relative ${
          menuon ? `shadow-dim` : `sm:-translate-x-48 md:-translate-x-48`
        }`}
      >
        <div className="mt-20 flex flex-col items-start">
          {menu.map((item, i) => (
            <Link
              to={`News-weather/${i === 0 ? "" : item}`}
              onClick={tabSelection}
              className={`relative my-5 w-full rounded-sm p-3  ${
                activetab === i ? "bg-green-200" : "hover:bg-[#a3ffb1]"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
