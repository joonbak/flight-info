import { useState, useRef, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

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
  CardAction,
  CardContent,
} from "./components/ui/card.jsx";

import { Input } from "./components/ui/input.jsx";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import GlobeWrapper from "./components/globe";

function App() {
  const [input, setInput] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);

  const globeEl = useRef();

  const arcData = useMemo(() => {
    if (!departureAirport || !arrivalAirport) return [];

    return [
      {
        startLat: departureAirport.latitude,
        startLng: departureAirport.longitude,
        endLat: arrivalAirport.latitude,
        endLng: arrivalAirport.longitude,
        color: "#0018f9",
        stroke: 1,
        scale: 0.3,
      },
    ];
  }, [departureAirport, arrivalAirport]);

  function formatTime(dateString) {
    if (!dateString) return "--";
    const [, timePart] = dateString.split("T");
    const [hours = "--", minutes = "--"] = timePart.split(":");
    return `${hours}:${minutes}`;
  }

  async function fetchAirportCoordinates(flightData) {
    const departureIata = flightData.data[0].departure.iata;
    const [departure] = await getAirportByIata(departureIata);

    const arrivalIata = flightData.data[0].arrival.iata;
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

  async function fetchFlightData({ queryKey }) {
    const [, flightNumber] = queryKey;
    const url = `/api/flight?flight_iata=${flightNumber}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching flight data");
    }
    const flightData = await response.json();

    await fetchAirportCoordinates(flightData);
    return flightData;
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["flight", flightNumber],
    queryFn: fetchFlightData,
    enabled: !!flightNumber,
  });

  const handleClick = () => {
    setFlightNumber(input);
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
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
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
              {error && <div>Could not find your flight number</div>}
              {data && (
                <div>
                  <div className="flex justify-between items-center mx-2">
                    <p className="font-bold text-2xl">
                      {data.data[0].flight.iata}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-400 mr-2 whitespace-nowrap">
                        Status:
                      </p>
                      <Badge className="flex bg-green-400">
                        {data.data[0].flight_status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mr-2">
                    <p className="ml-2 text-md text-gray-400">
                      {data.data[0].airline.name}
                    </p>
                    <div className="text-md text-gray-400">
                      {data.data[0].flight_date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="rounded-lg border-2 border-slate-500 w-48 p-2">
                      <div className="flex gap-1">
                        <PlaneTakeoff />
                        <p className="font-bold text-lg">
                          {data.data[0].departure.iata}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        Terminal {data.data[0].departure.terminal}
                      </p>
                      <Badge className="bg-yellow-400">
                        <ArrowUpRight />
                        {data.data[0].departure.gate}
                      </Badge>
                    </div>
                    <Plane className="rotate-45" />
                    <div className="rounded-lg border-2 border-slate-500 w-48 p-2">
                      <div className="flex gap-1">
                        <PlaneLanding />
                        <p className="font-bold text-lg">
                          {data.data[0].arrival.iata}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        Terminal {data.data[0].arrival.terminal}
                      </p>
                      <Badge className="bg-yellow-400">
                        <Briefcase />
                        {data.data[0].arrival.baggage}
                      </Badge>
                      <Badge className="bg-yellow-400">
                        <ArrowUpRight />
                        {data.data[0].arrival.gate}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex flex-col w-48 p-2">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 mr-2">Scheduled:</p>
                        <p className="font-semibold text-lg">
                          {formatTime(data.data[0].departure.scheduled)}
                        </p>
                      </div>
                      {["active", "landed"].includes(
                        data.data[0].flight_status
                      ) ? (
                        <div className="flex flex items-center justify-between">
                          <p className="text-gray-400 mr-2">Actual:</p>
                          <p className="font-semibold text-lg">
                            {formatTime(data.data[0].departure.actual)}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex items-center justify-between">
                          <p className="text-gray-400 mr-2">Estimated:</p>
                          <p className="font-semibold text-lg">
                            {formatTime(data.data[0].departure.estimated)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-48 p-2">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 mr-2">Scheduled:</p>
                        <p className="font-semibold text-lg">
                          {formatTime(data.data[0].arrival.scheduled)}
                        </p>
                      </div>
                      {data.data[0].flight_status === "landed" ? (
                        <div className="flex flex items-center justify-between">
                          <p className="text-gray-400 mr-2">Actual:</p>
                          <p className="font-semibold text-lg">
                            {formatTime(data.data[0].arrival.actual)}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex items-center justify-between">
                          <p className="text-gray-400 mr-2">Estimated:</p>
                          <p className="font-semibold text-lg">
                            {formatTime(data.data[0].arrival.estimated)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="absolute z-0">
          <GlobeWrapper ref={globeEl} arcData={arcData} />
        </div>
      </div>
    </div>
  );
}

export default App;
