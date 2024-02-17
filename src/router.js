import {
  Route,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import WeatherLocalisation from "./weather/WeatherLocalisation";
import WeatherCreateMyList from "./weather/WeatherCreateMyList";
import WeatherHome from "./weather/WeatherHome";
import RootLayout from "./layout/RootLayout";

const menu = ["Home", "Location", "My list"];

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<WeatherHome />} />
      <Route path="/Location" element={<WeatherLocalisation size="screen" />} />
      <Route path={`/${menu[2]}`} element={<WeatherCreateMyList />} />
    </Route>,
  ),
);
