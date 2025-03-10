"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiSearch,
  FiPlusCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simule une auth
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // État pour le menu utilisateur

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo - Aligné à gauche */}
        <div className="flex items-center">
          <Image src="/logoSafego.png" alt="SafeGo Logo" width={190} height={40} />
        </div>

        {/* Navigation - Alignée à droite */}
        <div className="hidden md:flex items-center gap-6 text-[#919191] font-medium ml-auto">
          {/* Recherche */}
          <a href="#" className="flex items-center gap-2 hover:text-black transition">
            <FiSearch size={20} /> Recherche
          </a>

          {/* Publier un trajet */}
          <a href="#" className="flex items-center gap-2 hover:text-black transition">
            <FiPlusCircle size={20} /> Publier un trajet
          </a>

          {/* Authentification */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-full"
            >
              <FiUser size={18} />
              {isUserMenuOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-48"
              >
                {isAuthenticated ? (
                  <>
                    <a href="#" className="block py-2 px-3 hover:bg-gray-100">
                      Profil
                    </a>
                    <a href="#" className="block py-2 px-3 hover:bg-gray-100">
                      Mes trajets
                    </a>
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="block w-full text-left py-2 px-3 hover:bg-red-100 text-red-600"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/login" className="block py-2 px-3 hover:bg-gray-100">
                      Connexion
                    </a>
                    <a href="/register" className="block py-2 px-3 hover:bg-gray-100">
                      Inscription
                    </a>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <button className="md:hidden text-[#919191] text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Navigation Mobile */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-md"
        >
          <a href="#" className="flex items-center gap-2 px-4 py-2 border-b hover:bg-gray-100">
            <FiSearch size={20} /> Recherche
          </a>
          <a href="#" className="flex items-center gap-2 px-4 py-2 border-b hover:bg-gray-100">
            <FiPlusCircle size={20} /> Publier un trajet
          </a>
          {!isAuthenticated && (
            <>
              <a href="/login" className="block px-4 py-2 border-b hover:bg-gray-100">
                Connexion
              </a>
              <a href="/register" className="block px-4 py-2 border-b hover:bg-gray-100">
                Inscription
              </a>
            </>
          )}
        </motion.nav>
      )}
    </header>
  );
}
