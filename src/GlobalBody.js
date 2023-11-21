import WeatherHome from "./weather/WeatherHome";

export default function GlobalBody() {
  return (
    <div className="flex justify-around m-1">
      <WeatherHome />
    </div>
  );
}
