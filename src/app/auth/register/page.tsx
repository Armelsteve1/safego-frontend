"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

const checkPasswordStrength = (password: string) => {
  const lengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);

  return {
    lengthValid,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    isValid: lengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
  };
};

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [agencyName, setAgencyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = checkPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (!passwordStrength.isValid) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      setLoading(false);
      return;
    }

    if (role === "agency" && !agencyName.trim()) {
      setError("Le nom de l'agence est obligatoire.");
      setLoading(false);
      return;
    }

    try {
      const body = {
        email,
        password,
        role,
        ...(role === "agency" && { agencyName }),
      };

      const response = await fetch("http://localhost:3001/safego/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Échec de l'inscription. Vérifiez vos informations.");
      }

      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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

        <h2 className="text-2xl font-bold text-center text-[#004aad]">Inscription</h2>
        <p className="text-center text-gray-600 mb-6">Créez votre compte SafeGo</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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
          <div className="text-sm text-gray-600">
            <p className={passwordStrength.lengthValid ? "text-green-600" : "text-red-600"}>
              {passwordStrength.lengthValid ? "✔" : "✖"} Minimum 8 caractères
            </p>
            <p className={passwordStrength.hasUpperCase ? "text-green-600" : "text-red-600"}>
              {passwordStrength.hasUpperCase ? "✔" : "✖"} Une lettre majuscule
            </p>
            <p className={passwordStrength.hasLowerCase ? "text-green-600" : "text-red-600"}>
              {passwordStrength.hasLowerCase ? "✔" : "✖"} Une lettre minuscule
            </p>
            <p className={passwordStrength.hasNumber ? "text-green-600" : "text-red-600"}>
              {passwordStrength.hasNumber ? "✔" : "✖"} Un chiffre
            </p>
            <p className={passwordStrength.hasSpecialChar ? "text-green-600" : "text-red-600"}>
              {passwordStrength.hasSpecialChar ? "✔" : "✖"} Un caractère spécial (!@#$...)
            </p>
          </div>

          <div>
            <label className="block text-gray-700">Confirmer le mot de passe</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Sélectionnez votre rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="user">Utilisateur</option>
              <option value="driver">Conducteur</option>
              <option value="agency">Agence</option>
            </select>
          </div>

          {role === "agency" && (
            <div>
              <label className="block text-gray-700">Nom de l'agence</label>
              <Input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                className="w-full"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#004aad] text-white hover:bg-[#003580] transition"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
