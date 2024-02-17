import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { QueryContext } from "../layout/RootLayout";

export default function Navigator(props) {
  const { menu } = props;
  const { menuOn, setMenuOn, menuListOn } = useContext(QueryContext);

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-fit select-none lg:sticky lg:w-[250px] lg:pr-6">
      <AiOutlineMenu
        className={`absolute left-7 top-5 z-20 h-10 w-10 rounded-xl border border-solid bg-slate-200 p-2 transition-all duration-150 hover:animate-pulse  hover:bg-slate-300 lg:hidden ${
          menuOn ? "-rotate-180" : ""
        } `}
        onClick={!menuListOn ? () => setMenuOn(!menuOn) : null}
      />

      <div
        className={`fixed left-0 top-0 z-30 flex h-full w-40 flex-col items-center overflow-hidden bg-opacity-80 bg-perso1 transition-transform duration-150 ease-out ${
          menuOn ? `shadow-dim` : `sm:-translate-x-48 md:-translate-x-48`
        }`}
      >
        <div className="mt-20 flex w-full flex-col items-start rounded-lg px-2">
          {menu.map((item, i) => (
            <NavLink
              key={item}
              to={`${i === 0 ? "/" : item.toLowerCase()}`}
              onClick={() => setMenuOn(false)}
              className={({ isActive }) => {
                return (
                  `relative my-5 w-full rounded-sm p-3 transition-colors duration-75 ease-in ` +
                  (isActive
                    ? `bg-blue-300/50 text-white`
                    : `hover:bg-white hover:bg-opacity-60`)
                );
              }}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
