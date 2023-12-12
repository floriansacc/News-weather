import WeatherHome from "./weather/WeatherHome";

export default function GlobalBody() {
  return (
    <div className="flex justify-around">
      <WeatherHome />
    </div>
  );
}
