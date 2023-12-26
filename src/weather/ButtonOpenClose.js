import { useContext } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { QueryContext } from "../GlobalBody";

export default function ButtonOpenClose(props) {
  const { foropen } = props;
  const { menuListOn, setMenuListOn } = useContext(QueryContext);

  return (
    <div
      className={`z-40 inline-flex h-fit w-fit select-none items-center justify-center rounded-xl p-1 ${
        foropen
          ? "relative mt-4 bg-red-200"
          : menuListOn && !foropen
            ? " hidden"
            : "fixed bottom-2 right-2 bg-green-600 bg-opacity-80"
      } `}
      onClick={() => setMenuListOn(!menuListOn)}
    >
      <p className="px-2">{`${foropen ? "Close" : "Open"}`} list</p>
      <IoIosAddCircleOutline
        className={`h-10 w-10 transition-all duration-300 ${
          menuListOn ? "rotate-[135deg]" : ""
        }`}
      />
    </div>
  );
}
