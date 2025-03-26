"use client";

import { FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { FaBus, FaCar } from "react-icons/fa";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseISO } from "date-fns/parseISO";
import { Trip } from "@/types/trip";

interface TripCardProps {
  trip: Trip;
  passengers: number;
}

const TripCard = ({ trip, passengers }: TripCardProps) => {
  const formattedDate = format(parseISO(trip.departureDate), "EEEE d MMMM yyyy", {
    locale: fr,
  });
  const formattedTime = trip.departureTime.slice(0, 5);
  const transportIcon =
    trip.tripType === "agence" ? (
      <FaBus className="text-gray-500 ml-2" size={20} />
    ) : (
      <FaCar className="text-gray-500 ml-2" size={20} />
    );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiMapPin className="text-gray-500" /> {trip.departure} → {trip.arrival}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            <FiClock className="inline mr-1 text-gray-500" />
            {formattedDate} • Départ {formattedTime}
          </p>
        </div>
        <p className="text-gradient-primary font-semibold text-xl">
          {(trip.price * passengers).toLocaleString()} <span className="ml-1">₣</span>
        </p>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      <div className="flex items-center">
        {trip?.driverProfilePicture ? (
          <Image
            src={trip.driverProfilePicture}
            alt="Driver"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <FiUser className="text-gray-500 w-10 h-10 border rounded-full p-2" />
        )}
        <p className="ml-2 text-gray-700 font-medium flex items-center">
          {trip?.driverName ? trip.driverName : "Conducteur inconnu"} ⭐ {trip?.rating || "4"}
          {transportIcon}
        </p>
      </div>
    </div>
  );
};

export default TripCard;
