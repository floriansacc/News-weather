import { useContext, useEffect, useRef, useState } from "react";
import { QueryContext } from "../../App";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { MdFullscreen } from "react-icons/md";

export default function WeatherRadar(props) {
  const { radar, setradar, timeTimer, tickDisplay } = props;
  const { baseTime, baseDate } = useContext(QueryContext);

  const [imgSrc, setImgSrc] = useState(0);
  const [widthBar, setWidthBar] = useState(0);
  const counter = useRef(0);
  const [isPaused, pause] = useState(true);
  const isPausedRef = useRef(isPaused);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const radarDiv = document.getElementById("radar-div");

  const handleChangeBar = (e) => {
    setImgSrc(parseInt(e.target.value));
    counter.current = parseInt(e.target.value);
  };

  const handleClickImage = (entry) => {
    if (imgSrc === radar.length - 1) {
      setImgSrc(0);
      counter.current = 0;
      pause(false);
    } else if (entry === "img") {
      pause(!isPaused);
    } else {
      pause(entry);
    }
  };

  const handleImageLoaded = () => {
    setIsImageLoaded(true);
  };

  const handleFullScreen = (e) => {
    if (!radarDiv) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      radarDiv.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!radarDiv) return;
    const handlePressSpace = (e) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault();
        pause(!isPausedRef.current);
      }
    };
    const handleFocus = (e) => {
      e.preventDefault();
      window.addEventListener("keydown", handlePressSpace);
    };
    const handleBlur = (e) => {
      e.preventDefault();
      window.removeEventListener("keydown", handlePressSpace);
    };

    radarDiv.addEventListener("focus", handleFocus);
    radarDiv.addEventListener("blur", handleBlur);
    return () => {
      radarDiv.removeEventListener("focus", handleFocus);
      radarDiv.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handlePressSpace);
    };
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!radarDiv) return;
    if (!isPaused && isImageLoaded) {
      const timer = setInterval(() => {
        if (radar[counter.current + 1]) {
          setImgSrc((prev) => prev + 1);
          setWidthBar((counter.current / radar.length) * 100);
          counter.current += 1;
        }
      }, timeTimer);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isPaused, isImageLoaded]);

  return (
    <div
      className="flex h-fit w-[90%] items-center justify-center"
      tabIndex={0}
      id="radar-div"
    >
      <div
        className={`${
          document.fullscreenElement
            ? "absolute aspect-square h-[90%] w-auto"
            : ""
        } flex flex-col items-end justify-around`}
      >
        <div className="hidden">
          <p className="font-bold">Test</p>
          <p className="font-bold">{imgSrc}</p>
          <p className="font-bold">{widthBar.toFixed(1)}</p>
        </div>
        <img
          className="h-full w-full"
          src={radar[imgSrc]}
          onLoad={handleImageLoaded}
          onClick={() => handleClickImage("img")}
        ></img>
        <div className="h-fit w-full px-4">
          <input
            className="w-full"
            type="range"
            min={0}
            max={radar.length - 1}
            list={radar[0]}
            value={imgSrc}
            onChange={handleChangeBar}
          ></input>
          {tickDisplay && (
            <datalist id={radar[0]}>
              {radar.map((x, i) => (
                <option value={i} />
              ))}
            </datalist>
          )}
        </div>
        <div className="flex flex-row gap-4 text-black">
          <div className="flex h-fit w-fit flex-row rounded-full bg-slate-100 p-1 transition-all">
            {isPaused && (
              <FaPlay
                className={`mx-1 h-6 w-6 transition-colors lg:hover:animate-pulse lg:hover:text-[#53789e]`}
                onClick={() => handleClickImage(false)}
              />
            )}
            {!isPaused && (
              <FaPause
                className={`mx-1 h-6 w-6 transition-colors lg:hover:animate-pulse lg:hover:text-[#53789e]`}
                onClick={() => handleClickImage(true)}
              />
            )}
          </div>
          <div className="flex h-fit w-fit flex-row rounded-full bg-slate-100 p-1 transition-all">
            <MdFullscreen className="mx-1 h-6 w-6" onClick={handleFullScreen} />
          </div>
        </div>
      </div>
    </div>
  );
}
