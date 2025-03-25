"use client";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/authContext";

export default function Hero() {
  const { state } = useAuth();

  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center text-white">
      {/* Fond principal : le vrai dégradé horizontal */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_#5de0e6,_#004aad)] opacity-90" />

      {/* Superposition sombre pour contraste texte */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-6">
        {state.isAuthenticated ? (
          <h1 className="text-3xl font-bold mb-4">Bienvenue, {state.user?.email} 👋</h1>
        ) : (
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Trouvez un trajet en toute sécurité !
          </motion.h1>
        )}
        <p className="text-lg mb-6 text-white/90">
          Voyagez sereinement avec des conducteurs vérifiés et des trajets sécurisés.
        </p>
        <SearchBar />
      </div>
    </div>
  );
}
