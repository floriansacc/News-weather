import { IoIosAddCircleOutline } from "react-icons/io";

export default function MenuOpenClose(props) {
  const { menuliston, setmenuliston, foropen } = props;
  return (
    <div
      className={`inline-flex h-fit w-fit select-none items-center justify-center rounded-xl  p-1 ${
        menuliston && !foropen
          ? " hidden "
          : menuliston && foropen
            ? "relative mt-4 bg-red-200"
            : "fixed bottom-5 right-5 bg-green-600 bg-opacity-80"
      } `}
      onClick={() => setmenuliston(!menuliston)}
    >
      <p className="px-2">{`${foropen ? "Close" : "Open"}`} list</p>
      <IoIosAddCircleOutline
        className={`h-10 w-10 transition-all duration-300 ${
          menuliston ? "rotate-[135deg]" : ""
        }`}
      />
    </div>
  );
}
