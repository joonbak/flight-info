import { useState, useRef, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getAirportByIata } from "airport-data-js";

import GlobeWrapper from "./components/globe";
import SidePanel from "./components/side-panel.jsx";

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
          <SidePanel
            input={input}
            setInput={setInput}
            handleClick={handleClick}
            data={data}
            isLoading={isLoading}
            error={error}
            formatTime={formatTime}
          />
        </div>
        <div className="absolute z-0">
          <GlobeWrapper ref={globeEl} arcData={arcData} />
        </div>
      </div>
    </div>
  );
}

export default App;
