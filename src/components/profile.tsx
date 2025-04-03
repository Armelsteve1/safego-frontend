"use client";

import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiUpload } from "react-icons/fi";
import { useAuth } from "@/context/authContext";
import Header from "./Header";
import NotificationPopup from "@/components/ui/NotificationPopup";
import { useFetchProfile } from "@/hooks/useFetchProfile";

const Profile = () => {
  const { state } = useAuth();
  const { profile, loading, error } = useFetchProfile();

  const [editableProfile, setEditableProfile] = useState<any>(profile || {});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Met à jour le profil éditable dès que le profil chargé change
  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
      setImagePreview(profile.picture || null);
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const { picture, email, username, ...updatableFields } = editableProfile;

      const res = await fetch("http://localhost:3001/safego/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(updatableFields),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      setNotification({ type: "success", message: "Profil mis à jour avec succès !" });
    } catch (err) {
      setNotification({ type: "error", message: "Impossible de mettre à jour le profil" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const res = await fetch("http://localhost:3001/safego/auth/profile/picture", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors du changement de photo");

      const data = await res.json();
      setEditableProfile((prev: any) => ({ ...prev, picture: data.picture }));
      setImagePreview(URL.createObjectURL(file));
      setNotification({ type: "success", message: "Photo de profil mise à jour !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de l’envoi de la photo" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 pb-10 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            <FiUser /> Mon Profil
          </h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {loading ? (
            <p className="text-center text-gray-500">Chargement du profil...</p>
          ) : (
            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center">
                <label className="relative cursor-pointer">
                  <img
                    src={imagePreview || "/default-avatar.png"}
                    alt="Profil"
                    className="w-24 h-24 rounded-full border-2 object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                    <FiUpload size={16} />
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-2">Changer la photo</p>
              </div>

              {/* Inputs */}
              <input
                type="text"
                placeholder="Prénom"
                value={editableProfile.given_name || ""}
                onChange={(e) =>
                  setEditableProfile({ ...editableProfile, given_name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                placeholder="Nom"
                value={editableProfile.family_name || ""}
                onChange={(e) =>
                  setEditableProfile({ ...editableProfile, family_name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="email"
                value={editableProfile.email || ""}
                disabled
                className="w-full border bg-gray-100 cursor-not-allowed rounded-lg px-3 py-2"
              />

              <input
                type="tel"
                placeholder="Téléphone (ex: +237612345678)"
                value={editableProfile.phone_number || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^+\d]/g, "");
                  setEditableProfile({ ...editableProfile, phone_number: value });
                }}
                className="w-full border rounded-lg px-3 py-2"
                pattern="^\+?[1-9]\d{1,14}$"
              />

              {editableProfile["custom:agencyName"] && (
                <input
                  type="text"
                  placeholder="Nom de l'agence"
                  value={editableProfile["custom:agencyName"] || ""}
                  onChange={(e) =>
                    setEditableProfile({ ...editableProfile, "custom:agencyName": e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 rounded-lg ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={saving}
              >
                {saving ? "Mise à jour..." : "Enregistrer les modifications"}
              </button>
            </form>
          )}
        </div>
      </div>

      {notification && (
        <NotificationPopup
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Profile;
