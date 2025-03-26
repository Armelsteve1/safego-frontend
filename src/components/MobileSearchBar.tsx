"use client";

import { FiSearch } from "react-icons/fi";

interface MobileSearchBarProps {
  departure: string;
  arrival: string;
  departureDate: string;
  passengers: number;
  onOpenFilter: () => void;
  onOpenSearch: () => void;
}

export default function MobileSearchBar({
  departure,
  arrival,
  departureDate,
  passengers,
  onOpenFilter,
  onOpenSearch,
}: MobileSearchBarProps) {
  return (
    <div className="lg:hidden w-full px-4 mt-2">
      <div className="flex items-center justify-between border rounded-full px-4 py-3 shadow-sm bg-white">
        <button
          onClick={onOpenSearch}
          className="flex items-start gap-3 text-sm text-gray-700 text-left"
        >
          <FiSearch className="mt-1 text-gray-500" size={18} />
          <div className="flex flex-col">
            <span className="font-medium">
              {departure || "Départ"} → {arrival || "Arrivée"}
            </span>
            <span className="text-xs text-gray-500">
              {departureDate || "Date"}, {passengers} passager{passengers > 1 ? "s" : ""}
            </span>
          </div>
        </button>
        <button
          onClick={onOpenFilter}
          className="text-primary text-sm font-semibold hover:underline"
        >
          Filtrer
        </button>
      </div>
    </div>
  );
}
