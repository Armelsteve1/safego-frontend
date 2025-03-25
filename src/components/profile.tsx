"use client";

import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiEdit3, FiUpload } from "react-icons/fi";
import { useAuth } from "@/context/authContext";

const Profile = () => {
  const { state } = useAuth();
  const [profile, setProfile] = useState<any>({
    given_name: "",
    family_name: "",
    email: "",
    phone_number: "",
    "custom:agencyName": "",
    picture: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/safego/auth/profile", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        const data = await res.json();
        setProfile(data);
        setImagePreview(data.picture || null);
      } catch (err) {
        setError("Erreur lors du chargement du profil");
      }
    };

    fetchProfile();
  }, [state.token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { picture, email, username, ...updatableFields } = profile;

      const res = await fetch("http://localhost:3001/safego/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(updatableFields),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      setSuccess(true);
    } catch (err) {
      setError("Impossible de mettre à jour le profil");
    } finally {
      setLoading(false);
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
      setProfile((prev: any) => ({ ...prev, picture: data.picture }));
      setImagePreview(URL.createObjectURL(file));
      setSuccess(true);
    } catch (err) {
      setError("Impossible d'envoyer la photo");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
        <FiUser /> Mon Profil
      </h2>

      {success && <p className="text-green-600 mt-3">Mis à jour avec succès !</p>}
      {error && <p className="text-red-500 mt-3">{error}</p>}

      <form onSubmit={handleUpdate} className="mt-6 space-y-4">
        <div className="flex flex-col items-center">
          <label className="relative cursor-pointer">
            <img
              src={imagePreview || "/default-avatar.png"}
              alt="Profil"
              className="w-24 h-24 rounded-full border-2 object-cover"
            />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
              <FiUpload size={16} />
            </div>
          </label>
          <p className="text-sm text-gray-500 mt-2">Changer la photo</p>
        </div>

        <input
          type="text"
          placeholder="Prénom"
          value={profile.given_name}
          onChange={(e) => setProfile({ ...profile, given_name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="Nom"
          value={profile.family_name}
          onChange={(e) => setProfile({ ...profile, family_name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full border bg-gray-100 cursor-not-allowed rounded-lg px-3 py-2"
        />

        <input
          type="tel"
          placeholder="Téléphone (ex: +237612345678)"
          value={profile.phone_number}
          onChange={(e) => {
            const value = e.target.value.replace(/[^+\d]/g, "");
            setProfile({ ...profile, phone_number: value });
          }}
          className="w-full border rounded-lg px-3 py-2"
          pattern="^\+?[1-9]\d{1,14}$"
        />

        {profile["custom:agencyName"] && (
          <input
            type="text"
            placeholder="Nom de l'agence"
            value={profile["custom:agencyName"]}
            onChange={(e) => setProfile({ ...profile, "custom:agencyName": e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
