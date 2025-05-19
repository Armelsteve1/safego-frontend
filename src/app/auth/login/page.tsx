"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { apiFetch } from "@/lib/api"; // ✅ import ici

export default function Login() {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          groups: data.groups || [],
        })
      );

      dispatch({
        type: "LOGIN",
        payload: {
          email: data.email,
          token: data.accessToken,
          groups: data.groups || [],
        },
      });

      const expirationTime = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200"
      >
        <div className="flex justify-center mb-6">
          <Image src="/logoSafego.png" alt="SafeGo Logo" width={120} height={120} />
        </div>

        <h2 className="text-2xl font-bold text-center text-[#004aad]">Connexion</h2>
        <p className="text-center text-gray-600 mb-6">Accédez à votre compte SafeGo</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#004aad] text-white hover:bg-[#003580] transition"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Mot de passe oublié ?{" "}
          <a href="/auth/forgot-password" className="text-[#004aad] hover:underline">
            Réinitialiser
          </a>
        </p>
        <p className="text-center text-gray-600 mt-2">
          Pas encore de compte ?{" "}
          <a href="/auth/register" className="text-[#004aad] hover:underline">
            S'inscrire
          </a>
        </p>
      </motion.div>
    </div>
  );
}
