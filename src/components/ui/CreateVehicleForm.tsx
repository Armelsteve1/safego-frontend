"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NotificationPopup from "@/components/ui/NotificationPopup";

interface VehicleFormData {
  name: string;
  capacity: number;
  registrationNumber: string;
  description?: string;
  type: string;
  category: string;
  image?: File;
}

interface CreateVehicleFormProps {
  onVehicleAdded: () => void;
}

const vehicleTypes = ["car", "bus", "van", "truck"];
const vehicleCategories = ["economy", "luxury", "standard"];

export default function CreateVehicleForm({ onVehicleAdded }: CreateVehicleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    setLoading(true);
    setNotification(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("capacity", data.capacity.toString());
    formData.append("registrationNumber", data.registrationNumber);
    formData.append("description", data.description || "");
    formData.append("type", data.type);
    formData.append("category", data.category);
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicules/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Ce véhicule est déjà enregistré.");
        }
        throw new Error("Échec de l'enregistrement du véhicule.");
      }

      setNotification({
        message: "Véhicule ajouté avec succès ! En attente de validation.",
        type: "success",
      });
      onVehicleAdded();
    } catch (err: any) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-[#004aad]">Créer un véhicule</h2>
        <p className="text-center text-gray-600 mb-6">
          Ajoutez un véhicule pour publier des trajets.
        </p>

        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nom du véhicule</label>
            <Input {...register("name", { required: "Ce champ est requis" })} className="w-full" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Capacité (nombre de places)</label>
            <Input
              type="number"
              {...register("capacity", { required: "Ce champ est requis" })}
              className="w-full"
            />
            {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Numéro d'immatriculation</label>
            <Input
              {...register("registrationNumber", { required: "Ce champ est requis" })}
              className="w-full"
            />
            {errors.registrationNumber && (
              <p className="text-red-500">{errors.registrationNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-gray-700">Type de véhicule</label>
            <select
              {...register("type", { required: "Sélectionnez un type" })}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Sélectionner</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-red-500">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Catégorie</label>
            <select
              {...register("category", { required: "Sélectionnez une catégorie" })}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Sélectionner</option>
              {vehicleCategories.map((category) => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Image du véhicule</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {imagePreview && (
            <div className="flex justify-center">
              <Image
                src={imagePreview}
                alt="Prévisualisation"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#004aad] text-white hover:bg-[#003580] transition"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Ajouter le véhicule"}
          </Button>
          <Button
            className="w-full mt-4 bg-gray-600 text-white hover:bg-gray-500 transition"
            onClick={() => router.push("/trips")}
          >
            Retour à la publication de trajet
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
