import Globe from "react-globe.gl";

import globeJson from "./assets/countries_110m.json";

function App() {
  const myData = [
    {
      lat: 29.953204744601763,
      lng: -90.08925929478903,
      altitude: 0.4,
      color: "#ff2c2c",
    },
  ];
  return (
    <div>
      <main>
        <div>
          <Globe
            globeOffset={[300, 0]}
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            hexPolygonsData={globeJson.features}
            hexPolygonColor={() => {
              return "#d1ffbd";
            }}
            pointsData={myData}
            pointColor="color"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
