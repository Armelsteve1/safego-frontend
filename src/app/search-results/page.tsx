"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import SortFilter from "@/components/SortFilter";
import TripTypeSelector from "@/components/TripTypeSelector";
import MobileSearchBar from "@/components/MobileSearchBar";
import { Trip } from "@/types/trip";
import useIsMobile from "@/hooks/useIsMobile";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  console.log("isMobile:", isMobile);

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
  console.log("isSearchOpen:", isSearchOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileSearchBar
        departure={departure}
        arrival={arrival}
        departureDate={departureDate}
        passengers={passengers}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <div className="hidden lg:flex w-full bg-white shadow-md py-4 px-4 sm:px-10 sticky top-[64px] z-40 justify-center">
        <div className="w-full max-w-4xl">
          <SearchBar
            initialDeparture={departure}
            initialArrival={arrival}
            initialDate={departureDate}
            onSearchDone={() => setIsSearchOpen(false)}
          />
        </div>
      </div>

      {isMobile && isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button
              className="text-sm text-primary font-semibold"
              onClick={() => setIsSearchOpen(false)}
            >
              ✕ Fermer
            </button>
          </div>
          <SearchBar
            initialDeparture={departure}
            initialArrival={arrival}
            initialDate={departureDate}
          />
        </div>
      )}

      <div className="pt-4 px-4 sm:px-6 space-y-6 max-w-7xl mx-auto">
        <TripTypeSelector
          selected={selectedTripType}
          onChange={setSelectedTripType}
          counts={tripCounts}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="hidden lg:block">
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
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {!loading && filteredTrips.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8M21 21L15 15M11 13C8.23858 13 6 10.7614 6 8C6 5.23858 8.23858 3 11 3C13.7614 3 16 5.23858 16 8C16 10.7614 13.7614 13 11 13Z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Aucun trajet trouvé</h3>
                  <p className="text-sm">
                    Essayez de modifier votre lieu de départ, d’arrivée ou la date du trajet.
                  </p>
                </div>
              )}

              {filteredTripsWithDriver.map((trip) => (
                <TripCard key={trip.id} trip={trip} passengers={passengers} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button
              className="text-sm text-primary font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              Fermer
            </button>
          </div>
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
        </div>
      )}
    </div>
  );
}
