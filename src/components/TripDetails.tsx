// TripDetails.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock, FiMapPin, FiUser, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { FaBus, FaCar } from "react-icons/fa";
import { Trip } from "@/types/trip";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/Header";
import { parseISO } from "date-fns/parseISO";

export default function TripDetails() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedTrip = localStorage.getItem("selectedTrip");
    if (storedTrip) setTrip(JSON.parse(storedTrip));
    else router.push("/");
  }, []);

  if (!trip) return null;

  const formattedDate = format(parseISO(trip.departureDate), "EEEE d MMMM yyyy", { locale: fr });
  const formattedTime = trip.departureTime.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold">{formattedDate}</h2>
          <div className="flex justify-between items-start">
            <div className="text-gray-700">
              <p className="flex items-center gap-2 font-medium">
                <span className="text-black">{trip.departure}</span> →{" "}
                <span className="text-black">{trip.arrival}</span>
              </p>
              <p className="text-sm text-gray-500">
                <FiClock className="inline mr-1" /> {formattedTime}
              </p>
            </div>
            <p className="text-gradient-primary font-semibold text-xl">
              {trip.price.toLocaleString()} <span className="ml-1">₣</span>
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            {trip?.driverProfilePicture ? (
              <Image
                src={trip.driverProfilePicture}
                alt="Driver"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <FiUser className="text-gray-500 w-12 h-12 border rounded-full p-2" />
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {trip?.driverName || "Conducteur inconnu"} ⭐ {trip?.rating || "4"}
              </p>
              <div className="flex gap-2 items-center text-sm text-gray-500">
                <FiCheckCircle className="text-blue-500" /> Profil Vérifié
              </div>
              <div className="flex gap-2 items-center text-sm text-gray-500">
                <FiAlertCircle className="text-yellow-500" /> Peut annuler parfois
              </div>
            </div>
            {trip.tripType === "agence" ? (
              <FaBus className="ml-auto text-gray-500" size={24} />
            ) : (
              <FaCar className="ml-auto text-gray-500" size={24} />
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow">
              Demander la réservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
