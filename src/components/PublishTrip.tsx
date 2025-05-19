"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotificationPopup from "@/components/ui/NotificationPopup";
import Header from "./Header";
import { apiFetchWithAuth } from "@/lib/api";

interface TripFormData {
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  tripDuration: string;
  seatsAvailable: number;
  price: number;
  vehicleId: string;
}


export default function PublishTrip() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token manquant");
        const data = await apiFetchWithAuth("/vehicules/my-vehicules", token);
        setVehicles(data);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    fetchVehicles();
  }, []);

  const onSubmit = async (data: TripFormData) => {
    if (data.vehicleId === "new") return router.push("/vehicules");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const payload = {
        ...data,
        seatsAvailable: Number(data.seatsAvailable),
        price: Number(data.price),
      };

      await apiFetchWithAuth("/trips", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setNotification({
        message: "Trajet publié avec succès ! En attente de validation.",
        type: "success",
      });

      router.push("/trips");
    } catch (err: any) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-[#004aad]">Publier un trajet</h2>
          <p className="text-center text-gray-600 mb-6">
            Proposez un trajet à la communauté SafeGo.
          </p>

          {notification && (
            <NotificationPopup
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Départ"
                {...register("departure", { required: "Ce champ est requis" })}
              />
              <Input
                placeholder="Arrivée"
                {...register("arrival", { required: "Ce champ est requis" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                {...register("departureDate", { required: "Ce champ est requis" })}
              />
              <Input
                type="time"
                {...register("departureTime", { required: "Ce champ est requis" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
             <Input
              type="time"
              placeholder="Heure d'arrivée"
              {...register("arrivalTime", { required: "Ce champ est requis" })}
            />

            <Input
              placeholder="Durée du trajet (ex: 2h30)"
              {...register("tripDuration", { required: "Ce champ est requis" })}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                min="1"
                placeholder="Nombre de places"
                {...register("seatsAvailable", { required: "Ce champ est requis" })}
              />
              <Input
                type="number"
                step="500"
                min="0"
                placeholder="Prix (en FCFA)"
                {...register("price", { required: "Ce champ est requis" })}
              />
            </div>

            <div>
              <label className="block text-gray-700">Choisir un véhicule</label>
              <select
                {...register("vehicleId", { required: "Sélectionnez un véhicule" })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Sélectionner</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </option>
                ))}
                <option value="new">🚗 Ajouter un nouveau véhicule</option>
              </select>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#004aad] text-white hover:bg-[#003580] transition"
              disabled={loading}
            >
              {loading ? "Publication en cours..." : "Publier le trajet"}
            </Button>

            <Button
              className="w-full mt-4 bg-gray-600 text-white hover:bg-gray-500 transition"
              onClick={() => router.push("/")}
            >
              Retour à l'accueil
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
