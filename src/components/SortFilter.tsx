"use client";

import { useState, useEffect } from "react";
import { FiClock, FiTrendingDown } from "react-icons/fi";
import { FaWalking, FaHourglassEnd, FaMedal, FaShieldAlt } from "react-icons/fa";

interface SortFilterProps {
  trips: any[];
  onSortChange: (sortType: string) => void;
  onTimeFilterChange: (timeRanges: string[]) => void;
  onTrustFilterChange: (trustFilters: string[]) => void;
}

const SortFilter = ({
  trips,
  onSortChange,
  onTimeFilterChange,
  onTrustFilterChange,
}: SortFilterProps) => {
  const [selectedSort, setSelectedSort] = useState("departureSoonest");
  const [selectedTimeFilters, setSelectedTimeFilters] = useState<string[]>([]);
  const [selectedTrustFilters, setSelectedTrustFilters] = useState<string[]>([]);

  const getTimeCounts = () => {
    const counts = { before06: 0, morning: 0, afternoon: 0, evening: 0 };

    trips.forEach((trip) => {
      const [hour] = trip.departureTime.split(":").map(Number);
      if (hour < 6) counts.before06++;
      else if (hour < 12) counts.morning++;
      else if (hour < 18) counts.afternoon++;
      else counts.evening++;
    });

    return counts;
  };

  const timeCounts = getTimeCounts();

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
    onSortChange(sortType);
  };

  const handleTimeFilterChange = (range: string) => {
    const newFilters = selectedTimeFilters.includes(range)
      ? selectedTimeFilters.filter((r) => r !== range)
      : [...selectedTimeFilters, range];

    setSelectedTimeFilters(newFilters);
    onTimeFilterChange(newFilters);
  };

  const handleTrustFilterChange = (filter: string) => {
    const newFilters = selectedTrustFilters.includes(filter)
      ? selectedTrustFilters.filter((r) => r !== filter)
      : [...selectedTrustFilters, filter];

    setSelectedTrustFilters(newFilters);
    onTrustFilterChange(newFilters);
  };

  const resetFilters = () => {
    setSelectedSort("departureSoonest");
    setSelectedTimeFilters([]);
    setSelectedTrustFilters([]);
    onSortChange("departureSoonest");
    onTimeFilterChange([]);
    onTrustFilterChange([]);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trier par</h3>
        <button className="text-blue-500 text-sm font-medium" onClick={resetFilters}>
          Tout effacer
        </button>
      </div>
      <ul className="space-y-3 mt-2">
        <li className="flex items-center gap-2">
          <input
            type="radio"
            name="sort"
            value="departureSoonest"
            checked={selectedSort === "departureSoonest"}
            onChange={() => handleSortChange("departureSoonest")}
            className="cursor-pointer"
          />
          Départ le plus tôt <FiClock className="text-gray-500" />
        </li>
        <li className="flex items-center gap-2">
          <input
            type="radio"
            name="sort"
            value="lowestPrice"
            checked={selectedSort === "lowestPrice"}
            onChange={() => handleSortChange("lowestPrice")}
            className="cursor-pointer"
          />
          Prix le plus bas <FiTrendingDown className="text-gray-500" />
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />

      <h3 className="text-lg font-semibold mb-2">Heure de départ</h3>
      <ul className="space-y-3">
        {[
          { label: "Avant 06:00", value: "before06", count: timeCounts.before06 },
          { label: "06:00 - 12:00", value: "morning", count: timeCounts.morning },
          { label: "12:01 - 18:00", value: "afternoon", count: timeCounts.afternoon },
          { label: "Après 18:00", value: "evening", count: timeCounts.evening },
        ].map(({ label, value, count }) => (
          <li key={value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedTimeFilters.includes(value)}
              onChange={() => handleTimeFilterChange(value)}
              className="cursor-pointer"
            />
            {label} <span className="text-gray-500">{count}</span>
          </li>
        ))}
      </ul>

      <hr className="my-4 border-gray-300" />

      <h3 className="text-lg font-semibold mb-2">Confiance et sécurité</h3>
      <ul className="space-y-3">
        {[
          {
            label: "Super Driver",
            value: "superDriver",
            count: 31,
            icon: <FaMedal className="text-blue-500" />,
          },
          {
            label: "Profil Vérifié",
            value: "verifiedProfile",
            count: 166,
            icon: <FaShieldAlt className="text-blue-500" />,
          },
        ].map(({ label, value, count, icon }) => (
          <li key={value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedTrustFilters.includes(value)}
              onChange={() => handleTrustFilterChange(value)}
              className="cursor-pointer"
            />
            {label} <span className="text-gray-500">{count}</span> {icon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortFilter;
