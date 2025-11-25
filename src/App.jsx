import { useState, useRef } from "react";

import Globe from "react-globe.gl";
import { useQuery } from "@tanstack/react-query";

import globeJson from "./assets/countries_110m.json";

import { getAirportByIata } from "airport-data-js";

import {
  Plane,
  ArrowUpRight,
  Briefcase,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";

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
import { Badge } from "./components/ui/badge";

const apiKey = import.meta.env.VITE_AVIATION_STACK_API_KEY;

function App() {
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
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);

  const globeEl = useRef();

  const arcData =
    departureAirport && arrivalAirport
      ? [
          {
            startLat: departureAirport.latitude,
            startLng: departureAirport.longitude,
            endLat: arrivalAirport.latitude,
            endLng: arrivalAirport.longitude,
            color: "#0018f9",
            stroke: 1,
            scale: 0.3,
          },
        ]
      : [];

  async function fetchAirportCoordinates() {
    const departureIata = flight_data.data[0].departure.iata;
    const [departure] = await getAirportByIata(departureIata);

    const arrivalIata = flight_data.data[0].arrival.iata;
    const [arrival] = await getAirportByIata(arrivalIata);

    setDepartureAirport(departure);
    setArrivalAirport(arrival);

    const midLat = (departure.latitude + arrival.latitude) / 2;
    const midLng = (departure.longitude + arrival.longitude) / 2;

    const duration = 1500;

    globeEl.current.pointOfView(
      {
        lat: midLat,
        lng: midLng,
        altitude: 2.5,
      },
      duration
    );
  }

  async function fetchFlightData() {
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching flight data");
    }
    const flightData = await response.json();
    console.log(flightData);
    setDepartureAirport(flightData.data[0].departure.iata);
    setArrivalAirport(flightData.data[0].arrival.iata);
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
          <Card className="w-136 h-[calc(100vh-2rem)]">
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
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
              <div className="flex justify-between items-center mx-2">
                <p className="font-bold text-2xl">
                  {flight_data.data[0].flight.iata}
                </p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-400 mr-2 whitespace-nowrap">
                    Status:
                  </p>
                  <Badge className="flex">
                    {flight_data.data[0].flight_status}
                  </Badge>
                </div>
              </div>
              <p className="ml-2 text-md text-gray-400">
                {flight_data.data[0].airline.name}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="rounded-lg border-2 border-slate-500 w-48 p-2">
                  <div className="flex gap-1">
                    <PlaneTakeoff />
                    <p className="font-bold text-lg">
                      {flight_data.data[0].departure.iata}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Terminal {flight_data.data[0].departure.terminal}
                  </p>
                  <Badge className="bg-yellow-400">
                    <ArrowUpRight />
                    {flight_data.data[0].departure.gate}
                  </Badge>
                </div>
                <Plane className="rotate-45" />
                <div className="rounded-lg border-2 border-slate-500 w-48 p-2">
                  <div className="flex gap-1">
                    <PlaneLanding />
                    <p className="font-bold text-lg">
                      {flight_data.data[0].arrival.iata}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Terminal {flight_data.data[0].arrival.terminal}
                  </p>
                  <Badge className="bg-yellow-400">
                    <Briefcase />
                    {flight_data.data[0].arrival.baggage}
                  </Badge>
                  <Badge className="bg-yellow-400">
                    <ArrowUpRight />
                    {flight_data.data[0].arrival.gate}
                  </Badge>
                </div>
              </div>
              <Button onClick={fetchAirportCoordinates}>click</Button>
            </CardContent>
          </Card>
        </div>
        <div className="absolute z-0">
          <Globe
            ref={globeEl}
            globeOffset={[300, 0]}
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            hexPolygonsData={globeJson.features}
            hexPolygonColor={() => {
              return "#d1ffbd";
            }}
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
