"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import { FaBus, FaCarSide, FaTruck } from "react-icons/fa"; // ✅ Correction ici
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const departure = searchParams.get("departure") || "";
  const arrival = searchParams.get("arrival") || "";
  const departureDate = searchParams.get("departureDate") || "";

  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [editTrip, setEditTrip] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const url = `http://localhost:3001/safego/trips?departure=${departure}&arrival=${arrival}&departureDate=${departureDate}`;
      console.log("🔍 URL API:", url);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur lors de la récupération des trajets");
        const data: Trip[] = await response.json();
        console.log("✅ Trajets reçus:", data);
        setTrips(data);
        setFilteredTrips(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [departure, arrival, departureDate]);

  const filterByVehicleType = (type: string) => {
    setVehicleType(type);
    if (type === "") {
      setFilteredTrips(trips);
    } else {
      setFilteredTrips(
        trips.filter((trip) => trip.vehicle.type.toLowerCase() === type.toLowerCase())
      );
    }
  };

  const handleEdit = (tripId: string) => {
    setEditTrip(editTrip === tripId ? null : tripId);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, tripId: string, field: keyof Trip) => {
    setFilteredTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === tripId ? { ...trip, [field]: e.target.value } : trip))
    );
  };

  const handleSave = async (trip: Trip) => {
    try {
      const response = await fetch(`http://localhost:3001/safego/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du trajet");

      const updatedTrip: Trip = await response.json();
      setTrips((prevTrips) => prevTrips.map((t) => (t.id === trip.id ? updatedTrip : t)));
      setFilteredTrips((prevTrips) => prevTrips.map((t) => (t.id === trip.id ? updatedTrip : t)));
      setEditTrip(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Résultats de recherche</h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && filteredTrips.length === 0 && <p>Aucun trajet trouvé.</p>}

      {/* Filtres par type de véhicule */}
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => filterByVehicleType("")}
          className={vehicleType === "" ? "bg-gray-700 text-white" : ""}
        >
          Tous
        </Button>
        <Button
          onClick={() => filterByVehicleType("Voiture")}
          className={vehicleType === "Voiture" ? "bg-gray-700 text-white" : ""}
        >
          <FaCarSide /> Voiture
        </Button>
        <Button
          onClick={() => filterByVehicleType("Bus")}
          className={vehicleType === "Bus" ? "bg-gray-700 text-white" : ""}
        >
          <FaBus /> Bus
        </Button>
        <Button
          onClick={() => filterByVehicleType("Car")}
          className={vehicleType === "Car" ? "bg-gray-700 text-white" : ""}
        >
          <FaTruck /> Car
        </Button>
      </div>

      {/* Affichage des trajets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrips.map((trip) => (
          <motion.div
            key={trip.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition transform hover:scale-105 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editTrip === trip.id ? (
              <div>
                <h3 className="text-lg font-semibold">
                  <Input
                    value={trip.departure}
                    onChange={(e) => handleChange(e, trip.id, "departure")}
                  />
                  {" → "}
                  <Input
                    value={trip.arrival}
                    onChange={(e) => handleChange(e, trip.id, "arrival")}
                  />
                </h3>
                <p>
                  <strong>Date:</strong>
                  <Input
                    type="date"
                    value={trip.departureDate.split("T")[0]}
                    onChange={(e) => handleChange(e, trip.id, "departureDate")}
                  />
                </p>
                <p>
                  <strong>Places disponibles:</strong>
                  <Input
                    type="number"
                    value={trip.seatsAvailable}
                    onChange={(e) => handleChange(e, trip.id, "seatsAvailable")}
                  />
                </p>
                <p>
                  <strong>Prix:</strong>
                  <Input
                    type="number"
                    value={trip.price}
                    onChange={(e) => handleChange(e, trip.id, "price")}
                  />{" "}
                  FCFA
                </p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleSave(trip)} className="bg-green-500 text-white">
                    <FiCheck /> Sauvegarder
                  </Button>
                  <Button onClick={() => setEditTrip(null)} className="bg-red-500 text-white">
                    <FiX /> Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">
                  {trip.departure} → {trip.arrival}
                </h3>
                <p>
                  <strong>Date:</strong> {new Date(trip.departureDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Places disponibles:</strong> {trip.seatsAvailable}
                </p>
                <p className="text-green-600 font-semibold">{trip.price.toLocaleString()} FCFA</p>
                <Button onClick={() => handleEdit(trip.id)} className="bg-blue-500 text-white mt-2">
                  <FiEdit /> Modifier
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
