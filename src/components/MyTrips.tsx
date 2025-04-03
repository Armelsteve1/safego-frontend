"use client";

import { useAuth } from "@/context/authContext";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { Trip } from "@/types/trip";
import { useEffect, useState } from "react";
import NotificationPopup from "@/components/ui/NotificationPopup";
import Header from "./Header";

const MyTrips = () => {
  const { profile, loading: profileLoading } = useFetchProfile();
  const { state } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchMyTrips = async () => {
      if (!state.token || !profile) return;

      try {
        setLoadingTrips(true);
        const res = await fetch(`http://localhost:3001/safego/trips/user/${profile.sub}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération des voyages");

        const data = await res.json();
        setTrips(data);
      } catch (error) {
        console.error("Erreur fetch trips:", error);
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchMyTrips();
  }, [profile, state.token]);

  const handleDelete = async () => {
    if (!deletingTrip) return;

    try {
      const res = await fetch(`http://localhost:3001/safego/trips/delete/${deletingTrip.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setTrips(trips.filter((trip) => trip.id !== deletingTrip.id));
      setNotification({ message: "Trajet supprimé avec succès !", type: "success" });
      setDeletingTrip(null);
    } catch (error) {
      console.error("Erreur suppression:", error);
      setNotification({ message: "Impossible de supprimer ce trajet.", type: "error" });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    try {
      const res = await fetch(`http://localhost:3001/safego/trips/${editingTrip.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(editingTrip),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      setTrips(trips.map((trip) => (trip.id === editingTrip.id ? editingTrip : trip)));
      setEditingTrip(null);
      setNotification({ message: "Trajet mis à jour avec succès !", type: "success" });
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      setNotification({ message: "Impossible de modifier ce trajet.", type: "error" });
    }
  };

  if (profileLoading || loadingTrips)
    return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <h1 className="text-2xl font-bold text-center mt-8 text-gray-800">Mes Voyages</h1>
      <p className="text-center text-gray-500 mb-4">
        Vous avez {trips.length} voyage{trips.length > 1 ? "s" : ""} enregistré
        {trips.length > 1 ? "s" : ""}.
      </p>
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Notification Popup */}
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {trips.length > 0 ? (
          <ul className="space-y-4">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {/* Image du conducteur */}
                  <img
                    src={trip.driverProfilePicture || "/default-avatar.png"}
                    alt="Driver"
                    className="w-16 h-16 rounded-full border"
                  />

                  {/* Détails du voyage */}
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {trip.departure} → {trip.arrival}
                    </p>
                    <p className="text-gray-500 text-sm">
                      🕒 {trip.departureDate} à {trip.departureTime}
                    </p>
                    <p className="text-gray-500 text-sm">
                      🚘 {trip.vehicle.name} - {trip.vehicle.category} (
                      {trip.vehicle.registrationNumber})
                    </p>
                    <p className="text-gray-500 text-sm">
                      👤 Conducteur: {trip.driverName || "Inconnu"}
                    </p>
                  </div>
                </div>

                {/* Statut, prix et actions */}
                <div className="flex flex-col gap-2 text-right">
                  <p className="text-blue-600 font-semibold">{trip.price} FCFA</p>
                  <p
                    className={`text-xs font-medium ${
                      trip.status === "validated" ? "text-green-600" : "text-orange-500"
                    }`}
                  >
                    {trip.status === "validated" ? "✔️ Validé" : "⏳ En attente"}
                  </p>
                  <button
                    onClick={() => setEditingTrip(trip)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setDeletingTrip(trip)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Aucun voyage trouvé.</p>
        )}

        {/* Popup Modification */}
        {editingTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Modifier le trajet</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={editingTrip.departure}
                  onChange={(e) => setEditingTrip({ ...editingTrip, departure: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Lieu de départ"
                />
                <input
                  type="text"
                  value={editingTrip.arrival}
                  onChange={(e) => setEditingTrip({ ...editingTrip, arrival: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Lieu d'arrivée"
                />
                <input
                  type="date"
                  value={editingTrip.departureDate}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, departureDate: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Date de départ"
                />
                <input
                  type="time"
                  value={editingTrip.departureTime}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, departureTime: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Heure de départ"
                />
                <input
                  type="number"
                  value={editingTrip.price}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, price: parseFloat(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Prix"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="w-full mt-2 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
                >
                  Annuler
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Popup Suppression */}
        {deletingTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Supprimer ce trajet ?</h3>
              <p className="mb-4 text-gray-600">Cette action est irréversible.</p>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition"
              >
                Supprimer
              </button>
              <button
                onClick={() => setDeletingTrip(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg w-full mt-2 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
