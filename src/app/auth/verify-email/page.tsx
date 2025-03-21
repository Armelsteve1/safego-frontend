"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const username = email;
    try {
      const response = await fetch("http://localhost:3001/safego/auth/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });

      if (!response.ok) {
        throw new Error("Échec de la validation. Vérifiez le code.");
      }

      router.push("/auth/login");
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

        <h2 className="text-2xl font-bold text-center text-[#004aad]">Validation de l'email</h2>
        <p className="text-center text-gray-600 mb-6">
          Un code vous a été envoyé à <strong>{email}</strong>
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label className="block text-gray-700">Code de validation</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#004aad] text-white hover:bg-[#003580] transition"
            disabled={loading}
          >
            {loading ? "Vérification..." : "Valider mon compte"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
