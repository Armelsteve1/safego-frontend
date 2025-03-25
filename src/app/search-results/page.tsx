"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { FiClock, FiTrendingDown, FiMapPin, FiUser, FiTruck } from "react-icons/fi";
import Image from "next/image";
import { FaIdCard } from "react-icons/fa";
import TripCard from "@/components/TripCard";
import SortFilter from "@/components/SortFilter";

interface vehicule {
  id: string;
  name: string;
  type: string;
  capacity: number;
  registrationNumber: string;
  description: string;
  images: string | null;
}

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  seatsAvailable: number;
  driverName: string;
  rating?: number;
  driverProfilePicture: string | null;
  price: number;
  status: string;
  createdById: string;
  createdAt: string;
  tripType: "covoiturage" | "agence";
  vehicule: vehicule;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const departure = searchParams.get("departure") || "";
  const arrival = searchParams.get("arrival") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const passengers = parseInt(searchParams.get("seatsAvailable") || "1", 10);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/safego/trips?departure=${departure}&arrival=${arrival}&departureDate=${departureDate}`
        );
        if (!response.ok) throw new Error("Erreur lors de la récupération des trajets");
        const data: Trip[] = await response.json();
        setTrips(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [departure, arrival, departureDate]);

  const filteredTrips = selectedTripType
    ? trips.filter((trip) => trip.tripType === selectedTripType.toLowerCase())
    : trips;

  const filteredTripsWithDriver = filteredTrips.map((trip) => ({
    ...trip,
    driverName: trip.driverName || "Inconnu",
    rating: trip?.rating || 0,
    driverProfilePicture: trip?.driverProfilePicture || null,
  }));

  const tripCounts = {
    total: trips.length,
    agence: trips.filter((trip) => trip.tripType === "agence").length,
    covoiturage: trips.filter((trip) => trip.tripType === "covoiturage").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full bg-white shadow-md py-4 px-4 sm:px-10 sticky top-[64px] z-40 flex justify-center">
        <div className="w-full max-w-4xl">
          <SearchBar
            initialDeparture={departure}
            initialArrival={arrival}
            initialDate={departureDate}
          />
        </div>
      </div>
      <div className="mt-10 px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <SortFilter
          trips={trips}
          onSortChange={(sortType) => console.log("Tri sélectionné :", sortType)}
          onTimeFilterChange={(timeRanges) =>
            console.log("Plages horaires sélectionnées :", timeRanges)
          }
          onTrustFilterChange={(trustFilters) =>
            console.log("Filtres de confiance :", trustFilters)
          }
        />

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white shadow-md py-4 px-6 sm:px-10 rounded-lg flex justify-between items-center">
            <div className="text-lg font-semibold">Type de voyage</div>
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center gap-2 text-gray-700 ${
                  !selectedTripType ? "font-bold border-b-2 border-gray-700" : ""
                }`}
                onClick={() => setSelectedTripType(null)}
              >
                Tout • {tripCounts.total}
              </button>
              <button
                className={`flex items-center gap-2 text-gray-700 ${
                  selectedTripType === "agence" ? "font-bold border-b-2 border-gray-700" : ""
                }`}
                onClick={() => setSelectedTripType("agence")}
              >
                <FiTruck size={18} /> Agence • {tripCounts.agence}
              </button>
              <button
                className={`flex items-center gap-2 text-gray-700 ${
                  selectedTripType === "covoiturage" ? "font-bold border-b-2 border-gray-700" : ""
                }`}
                onClick={() => setSelectedTripType("covoiturage")}
              >
                <FaIdCard size={18} /> Covoiturage • {tripCounts.covoiturage}
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold">
              {loading ? "Chargement..." : `${filteredTrips.length} trajets disponibles`}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {!loading && filteredTrips.length === 0 && <p>Aucun trajet trouvé.</p>}

            {filteredTripsWithDriver.map((trip) => (
              <TripCard key={trip.id} trip={trip} passengers={passengers} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
