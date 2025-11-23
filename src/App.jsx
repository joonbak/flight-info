import Globe from "react-globe.gl";

import globeJson from "./assets/countries_110m.json";

import { Plane } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./components/ui/card.jsx";

import { Input } from "./components/ui/input.jsx";
import { Button } from "./components/ui/button";

function App() {
  const myData = [
    {
      lat: -33.947346,
      lng: 151.179428,
      altitude: 0.4,
      color: "#ff2c2c",
    },
  ];
  return (
    <div className="fixed">
      <div className="relative">
        <div className="absolute z-10 mt-4 ml-4">
          <Card className="w-104 h-[calc(100vh-2rem)]">
            <div className="flex justify-center">
              <p className="font-bold text-lg">Flight Tracker</p>
            </div>
            <CardHeader>
              <CardTitle>
                <Input placeholder="Enter Flight Number" />
              </CardTitle>
              <CardAction>
                <Button variant="outline" size="icon">
                  <Plane />
                </Button>
              </CardAction>
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
