import stations from "../fetch/stations.json";
import dataimport from "../fetch/dataimport.json";

export default function ForStationCompletion() {
  function calcDistance(x1, y1, x2, y2) {
    const X = x2 - x1;
    const Y = y2 - y1;
    return Math.sqrt(X * X + Y * Y);
  }

  const findclosest = (cities, stations) => {
    cities.forEach((city) => {
      let stationName = null;
      let minDistance = null;
      stations.forEach((station) => {
        const distance = calcDistance(
          station["dmX"],
          station["dmY"],
          city["latitude"],
          city["longitude"],
        );
        if (minDistance === null || distance < minDistance) {
          minDistance = distance;
          stationName = station["stationName"];
        }
      });
      city["stationName"] = stationName;
    });
    window.console.log(cities);
    //return stationName;
  };

  findclosest(dataimport, stations);

  return (
    <div>
      <div></div>
    </div>
  );
}
