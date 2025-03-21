"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateVehicleForm from "@/components/ui/CreateVehicleForm";

export default function VehiclesPage() {
  const router = useRouter();
  const [vehiculeAdded, setVehiculeAdded] = useState(false);

  const handleVehicleAdded = () => {
    setVehiculeAdded(true);
    router.push("/trips");
  };

  return <CreateVehicleForm onVehicleAdded={handleVehicleAdded} />;
}
