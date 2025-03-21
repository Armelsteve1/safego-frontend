"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { FiClock, FiDollarSign, FiMapPin, FiUser } from "react-icons/fi";
import Image from "next/image";

interface Vehicle {
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
  seatsAvailable: number;
  price: number;
  status: string;
  createdById: string;
  createdAt: string;
  vehicle: Vehicle;
  driver: {
    name: string;
    rating: number;
    profilePicture: string | null;
  };
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

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="fixed top-16 left-0 right-0 z-50 flex justify-center">
        <SearchBar
          initialDeparture={departure}
          initialArrival={arrival}
          initialDate={departureDate}
        />
      </div>

      <div className="mt-36 px-6 flex gap-6">
        {/* Filtres */}
        <div className="w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Trier par</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
              <FiClock /> Départ le plus tôt
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
              <FiDollarSign /> Prix le plus bas
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
              <FiMapPin /> Proche du point de départ
            </li>
          </ul>
        </div>

        {/* Résultats */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-bold">
            {loading ? "Chargement..." : `${trips.length} trajets disponibles`}
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          {!loading && trips.length === 0 && <p>Aucun trajet trouvé.</p>}
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiMapPin className="text-blue-500" /> {trip.departure} → {trip.arrival}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(trip.departureDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-green-600 font-semibold text-xl">
                  {(trip.price * passengers).toLocaleString()} FCFA
                </p>
              </div>
              <div className="flex items-center mt-4 border-t pt-2">
                {trip.driver?.profilePicture ? (
                  <Image
                    src={trip.driver.profilePicture}
                    alt="Driver"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <FiUser className="text-gray-500 w-10 h-10 border rounded-full p-2" />
                )}
                <p className="ml-2 text-gray-700 font-medium">
                  {trip.driver?.name ? trip.driver.name : "Conducteur inconnu"} ⭐{" "}
                  {trip.driver?.rating || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
