"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NotificationPopup from "@/components/ui/NotificationPopup";
import AdminSidebar from "@/components/ui/AdminSidebar";
import CollapsibleCard from "@/components/ui/CollapsibleCard";
import { apiFetchWithAuth } from "@/lib/api";

interface User {
  username: string;
  email: string;
  role: string;
  isValidated: boolean;
  isVerified: boolean;
}

interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
  isValidated: boolean;
}

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  departureDate: string;
  price: number;
  isValidated: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous connecter.");

      const [pendingUsers, pendingVehicles, allTrips] = await Promise.all([
        apiFetchWithAuth("/admin/pending", token),
        apiFetchWithAuth("/vehicules/pending", token),
        apiFetchWithAuth("/trips", token),
      ]);

      setUsers(pendingUsers);
      setVehicles(pendingVehicles);
      setTrips(allTrips);
    } catch (err) {
      console.error("❌ Erreur de chargement :", err);
    }
  }

  const getValidationStatus = (value: boolean) => (
    <span className={value ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
      {value ? "✅ Oui" : "❌ Non"}
    </span>
  );

  const getValidationButton = (type: "users" | "vehicules" | "trips", id: string) => (
    <Button onClick={() => validateItem(type, id)} className="bg-blue-500 text-white">
      Valider
    </Button>
  );

  const validateItem = async (type: "users" | "vehicules" | "trips", id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");
      await apiFetchWithAuth(`/${type}/validate/${id}`, token, {
        method: "PATCH",
      });

      setNotification({ message: `${type} validé avec succès !`, type: "success" });
      fetchData();
    } catch (err) {
      setNotification({ message: "Erreur lors de la validation.", type: "error" });
      console.error("❌ Erreur lors de la validation :", err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="pl-64 p-8 w-full">
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <CollapsibleCard title="Utilisateurs en attente">
          <DataGrid
            rows={users}
            columns={[
              { field: "email", headerName: "Email", width: 250 },
              { field: "role", headerName: "Rôle", width: 150 },
              {
                field: "isValidated",
                headerName: "Validé",
                width: 120,
                renderCell: (params) => getValidationStatus(params.value),
              },
              {
                field: "action",
                headerName: "Action",
                width: 150,
                renderCell: (params) => getValidationButton("users", params.row.username),
              },
            ]}
            autoHeight
            getRowId={(row) => row.username}
          />
        </CollapsibleCard>

        <CollapsibleCard title="Véhicules en attente">
          <DataGrid
            rows={vehicles}
            columns={[
              { field: "name", headerName: "Nom du véhicule", width: 200 },
              { field: "registrationNumber", headerName: "Immatriculation", width: 200 },
              {
                field: "isValidated",
                headerName: "Validé",
                width: 120,
                renderCell: (params) => getValidationStatus(params.value),
              },
              {
                field: "action",
                headerName: "Action",
                width: 150,
                renderCell: (params) => getValidationButton("vehicules", params.row.id),
              },
            ]}
            autoHeight
            getRowId={(row) => row.id}
          />
        </CollapsibleCard>

        <CollapsibleCard title="Trajets en attente">
          <DataGrid
            rows={trips}
            columns={[
              { field: "departure", headerName: "Départ", width: 150 },
              { field: "arrival", headerName: "Arrivée", width: 150 },
              { field: "departureDate", headerName: "Date", width: 150 },
              { field: "price", headerName: "Prix (FCFA)", width: 120 },
              {
                field: "isValidated",
                headerName: "Validé",
                width: 120,
                renderCell: (params) => getValidationStatus(params.value),
              },
              {
                field: "action",
                headerName: "Action",
                width: 150,
                renderCell: (params) => getValidationButton("trips", params.row.id),
              },
            ]}
            autoHeight
            getRowId={(row) => row.id}
          />
        </CollapsibleCard>
      </div>
    </div>
  );
}
