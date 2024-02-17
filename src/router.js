import {
  Route,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import WeatherLocalisation from "./weather/WeatherLocalisation";
import WeatherCreateMyList from "./weather/WeatherCreateMyList";
import WeatherHome from "./weather/WeatherHome";
import WeatherRadars from "./weather/WeatherRadars";
import RootLayout from "./layout/RootLayout";

export const menu = ["Home", "Location", "Radar", "My list"];

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<WeatherHome />} />
      <Route
        path={`${menu[1].toLowerCase()}`}
        element={<WeatherLocalisation size="screen" />}
      />
      <Route path={`${menu[2].toLowerCase()}`} element={<WeatherRadars />} />
      <Route
        path={`${menu[3].toLowerCase()}`}
        element={<WeatherCreateMyList />}
      />
    </Route>,
  ),
);

// [
//   {
//     patch: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         path: `/`,
//         element: <WeatherHome />,
//       },
//       {
//         path: `${menu[1]}`,
//         element: <WeatherLocalisation />,
//       },
//       {
//         patch: `${menu[2]}`,
//         element: <WeatherCreateMyList />,
//       },
//     ],
//   },
// ]
