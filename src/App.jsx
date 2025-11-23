import { useState } from "react";

import Globe from "react-globe.gl";
import { useQuery } from "@tanstack/react-query";

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

const apiKey = import.meta.env.VITE_AVIATION_STACK_API_KEY;

function App() {
  const arcData = [
    {
      startLat: -33.947346,
      startLng: 151.179428,
      endLat: 28.621322361013092,
      endLng: 77.20347613099612,
      color: "#0018f9",
      stroke: 1,
      scale: 0.3,
    },
  ];
  const myData = [
    {
      lat: -33.947346,
      lng: 151.179428,
      altitude: 0.4,
      color: "#ff2c2c",
    },
    {
      lat: 28.621322361013092,
      lng: 77.20347613099612,
      altitude: 0.4,
      color: "#00bf00",
    },
  ];

  const flight_data = {
    pagination: {
      limit: 100,
      offset: 0,
      count: 2,
      total: 2,
    },
    data: [
      {
        flight_date: "2025-11-23",
        flight_status: "landed",
        departure: {
          airport: "Sydney Kingsford Smith Airport",
          timezone: "Australia/Sydney",
          iata: "SYD",
          icao: "YSSY",
          terminal: "1",
          gate: "F",
          delay: 34,
          scheduled: "2025-11-23T09:10:00+00:00",
          estimated: "2025-11-23T09:10:00+00:00",
          actual: "2025-11-23T09:43:00+00:00",
          estimated_runway: "2025-11-23T09:43:00+00:00",
          actual_runway: "2025-11-23T09:43:00+00:00",
        },
        arrival: {
          airport: "Seoul (Incheon)",
          timezone: "Asia/Seoul",
          iata: "ICN",
          icao: "RKSI",
          terminal: "2",
          gate: "224",
          baggage: "7",
          scheduled: "2025-11-23T17:50:00+00:00",
          delay: null,
          estimated: "2025-11-23T17:22:00+00:00",
          actual: "2025-11-23T17:25:00+00:00",
          estimated_runway: "2025-11-23T17:25:00+00:00",
          actual_runway: "2025-11-23T17:25:00+00:00",
        },
        airline: {
          name: "Korean Air",
          iata: "KE",
          icao: "KAL",
        },
        flight: {
          number: "402",
          iata: "KE402",
          icao: "KAL402",
          codeshared: null,
        },
        aircraft: {
          registration: "HL8538",
          iata: "B78X",
          icao: "B78X",
          icao24: "71C538",
        },
        live: null,
      },
      {
        flight_date: "2025-11-22",
        flight_status: "landed",
        departure: {
          airport: "Sydney Kingsford Smith Airport",
          timezone: "Australia/Sydney",
          iata: "SYD",
          icao: "YSSY",
          terminal: "1",
          gate: "F",
          delay: 18,
          scheduled: "2025-11-22T09:10:00+00:00",
          estimated: "2025-11-22T09:10:00+00:00",
          actual: "2025-11-22T09:27:00+00:00",
          estimated_runway: "2025-11-22T09:27:00+00:00",
          actual_runway: "2025-11-22T09:27:00+00:00",
        },
        arrival: {
          airport: "Seoul (Incheon)",
          timezone: "Asia/Seoul",
          iata: "ICN",
          icao: "RKSI",
          terminal: "2",
          gate: "225",
          baggage: "10",
          scheduled: "2025-11-22T17:50:00+00:00",
          delay: null,
          estimated: "2025-11-22T17:16:00+00:00",
          actual: "2025-11-22T17:17:00+00:00",
          estimated_runway: "2025-11-22T17:17:00+00:00",
          actual_runway: "2025-11-22T17:17:00+00:00",
        },
        airline: {
          name: "Korean Air",
          iata: "KE",
          icao: "KAL",
        },
        flight: {
          number: "402",
          iata: "KE402",
          icao: "KAL402",
          codeshared: null,
        },
        aircraft: {
          registration: "HL8536",
          iata: "B78X",
          icao: "B78X",
          icao24: "71C536",
        },
        live: null,
      },
    ],
  };

  const [flightNumber, setFlightNumber] = useState("");

  async function fetchFlightData() {
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching flight data");
    }
    const flightData = await response.json();
    console.log(flightData);
    return flightData;
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["flight", flightNumber],
    queryFn: fetchFlightData,
    enabled: false,
  });

  const handleClick = () => {
    refetch();
  };

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
                <Input
                  type="text"
                  placeholder="Enter Flight Number"
                  onChange={(e) => setFlightNumber(e.target.value)}
                  value={flightNumber}
                />
              </CardTitle>
              <CardAction>
                <Button variant="outline" size="icon" onClick={handleClick}>
                  <Plane />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {isLoading && <div>Loading...</div>}
              {error && <div>Error: {error.message}</div>}
              {data && (
                <div>
                  <p className="font-semibold mb-2">Flight Data:</p>
                  <p>{JSON.stringify(data, null, 2)}</p>
                </div>
              )}
              <p>{flight_data.data[0].flight_date}</p>
            </CardContent>
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
            arcsData={arcData}
            arcColor="color"
            arcStroke="stroke"
            arcAltitudeAutoScale="scale"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
