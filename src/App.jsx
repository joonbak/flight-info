import Globe from "react-globe.gl";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card.jsx";

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
    <div className="fixed">
      <div className="relative">
        <div className="absolute z-10 mt-4 ml-4">
          <Card className="w-96 h-[calc(100vh-2rem)]">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
              <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
        <div className="absolute z-0">
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
      </div>
    </div>
  );
}

export default App;
