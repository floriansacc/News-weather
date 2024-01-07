import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { QueryContext } from "../App";

export default function Navigator(props) {
  const { menu } = props;
  const { menuOn, setMenuOn, menuListOn, activeTab, setActiveTab } =
    useContext(QueryContext);

  const tabSelection = (e) => {
    menu.forEach((x, i) => {
      if (e.target.innerHTML === menu[i]) {
        if (activeTab !== i) {
          setActiveTab(i);
          setMenuOn(false);
          sessionStorage.setItem("lastTab", i);
        }
      }
    });
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-screen select-none lg:sticky lg:mr-6">
      <AiOutlineMenu
        className={`absolute left-7 top-5 z-40 h-10 w-10 rounded-xl border border-solid bg-slate-200 p-2 transition-all duration-300 hover:animate-pulse  hover:bg-slate-300 lg:hidden ${
          menuOn ? "-rotate-180" : ""
        } `}
        onClick={!menuListOn ? () => setMenuOn(!menuOn) : null}
      />

      <div
        className={`fixed left-0 top-0 z-30 flex h-full w-40 flex-col items-center overflow-hidden bg-green-600 bg-opacity-80 transition-transform duration-300 ease-out lg:relative ${
          menuOn ? `shadow-dim` : `sm:-translate-x-48 md:-translate-x-48`
        }`}
      >
        <div className="mt-20 flex flex-col items-start">
          {menu.map((item, i) => (
            <Link
              to={`${i === 0 ? "/" : item}`}
              onClick={tabSelection}
              className={`relative my-5 w-full rounded-sm p-3  ${
                activeTab === i ? "bg-green-200" : "hover:bg-[#a3ffb1]"
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
