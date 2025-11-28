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
} from "./ui/card.jsx";

import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function SidePanel({
  input,
  setInput,
  handleClick,
  data,
  isLoading,
  error,
  formatTime,
}) {
  return (
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
              <p className="font-bold text-2xl">{data.data[0].flight.iata}</p>
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
                {["active", "landed"].includes(data.data[0].flight_status) ? (
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
  );
}
