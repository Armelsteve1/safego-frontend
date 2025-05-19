"use client";

import { useSearchParams } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiClock, FiCreditCard, FiUser } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import Image from "next/image";
import { parseISO } from "date-fns/parseISO";
import { Trip } from "@/types/trip";
import Header from "@/components/Header";
import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import format from "date-fns/format";
import { fr } from "date-fns/locale/fr";

export default function TripDetails({ trip }: { trip: Trip }) {
  const searchParams = useSearchParams();
  const passengerCount = parseInt(searchParams.get("passengers") || "1", 10);
  // @ts-ignore
  const formattedDate = format(parseISO(trip.departureDate), "EEEE d MMMM yyyy", { locale: fr });
  const formattedTime = trip.departureTime.slice(0, 5);
  const totalPrice = Number(trip.price) * passengerCount;

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
              <p className="text-sm text-gray-600 mt-1">
                {passengerCount} passager{passengerCount > 1 ? "s" : ""} •{" "}
                {Number(trip.price).toLocaleString()} ₣ / pers
              </p>
            </div>
            <p className="text-gradient-primary font-semibold text-xl">
              {totalPrice.toLocaleString()} <span className="ml-1">₣</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-4">
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
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {trip.driverName || "Conducteur inconnu"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  ⭐ {trip.rating || "4,5"} / 5 <span className="text-xs">•</span> 3 avis
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-700 gap-2">
              <FiCheckCircle className="text-blue-500" />
              Profil Vérifié
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2">
              <FiAlertCircle className="text-yellow-500" />
              Annule parfois ses trajets
            </div>

            <hr className="border-gray-200" />

            <div className="text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FiCreditCard /> Votre réservation sera confirmée lorsque le conducteur acceptera
                votre demande
              </p>
            </div>

            {trip.vehicle && (
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <FaCar className="text-gray-500" />
                {trip.vehicle.name.toUpperCase()} - {trip.vehicle.registrationNumber.toUpperCase()}
              </div>
            )}

            <button className="text-blue-600 font-medium text-sm border border-blue-500 rounded-full px-4 py-2 hover:bg-blue-50 transition">
              💬 Contacter {trip.driverName?.split(" ")[0] || "le conducteur"}
            </button>
          </div>

          <div className="fixed bottom-4 left-4 right-4 sm:static sm:mt-4 mt-6 flex justify-center">
            <ResponsiveButton>
              <FiCreditCard size={18} />
              Demande de réservation
            </ResponsiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
