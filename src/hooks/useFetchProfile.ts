import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";

export const useFetchProfile = () => {
  const { state } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!state.token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération du profil");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [state.token]);

  return { profile, loading, error };
};
