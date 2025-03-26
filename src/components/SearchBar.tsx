"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiCalendar, FiUser, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialDeparture?: string;
  initialArrival?: string;
  initialDate?: string;
  onSearchDone?: () => void;
}

export default function SearchBar({
  initialDeparture = "",
  initialArrival = "",
  initialDate = "",
  onSearchDone,
}: SearchBarProps) {
  const router = useRouter();
  const [departure, setDeparture] = useState(initialDeparture);
  const [destination, setDestination] = useState(initialArrival);
  const [date, setDate] = useState(initialDate);
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    if (onSearchDone) onSearchDone();
    router.push(
      `/search-results?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(destination)}&departureDate=${date}&seatsAvailable=${passengers}`
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3 items-center justify-center w-full max-w-3xl text-black">
      <div className="flex items-center gap-2 flex-1">
        <FiMapPin className="text-[#919191]" />
        <Input
          type="text"
          placeholder="Départ"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#919191]"
        />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <FiMapPin className="text-[#919191]" />
        <Input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#919191]"
        />
      </div>
      <div className="flex items-center gap-2">
        <FiCalendar className="text-[#919191]" />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#919191]"
        />
      </div>
      <div className="flex items-center gap-2">
        <FiUser className="text-[#919191]" />
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={passengers}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value >= 1) setPassengers(value);
            }}
            className="w-12 text-center outline-none px-2 py-2"
          />
          <button
            type="button"
            onClick={() => setPassengers(passengers + 1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="bg-[#919191] text-white px-6 py-2 rounded-lg hover:bg-[#000000] transition flex items-center gap-2"
      >
        <FiSearch /> Rechercher
      </Button>
    </div>
  );
}
