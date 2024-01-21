import { useContext } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { QueryContext } from "../App";

export default function ButtonOpenClose(props) {
  const { foropen } = props;
  const { menuListOn, setMenuListOn } = useContext(QueryContext);

  return (
    <div
      className={`z-40 inline-flex h-fit w-fit select-none items-center justify-center rounded-xl p-1 transition-colors duration-150 ease-in ${
        foropen
          ? "relative mt-4 bg-red-200 hover:bg-red-100"
          : menuListOn && !foropen
            ? "fixed bottom-2 right-2 opacity-0"
            : "fixed bottom-2 right-2 bg-green-600 bg-opacity-80 hover:bg-green-500"
      } `}
      onClick={() => setMenuListOn(!menuListOn)}
    >
      {foropen && <p className="px-2">Close list</p>}
      <IoIosAddCircleOutline
        className={`h-10 w-10 transition-all duration-300 ${
          menuListOn ? "rotate-[135deg]" : ""
        }`}
      />
    </div>
  );
}
