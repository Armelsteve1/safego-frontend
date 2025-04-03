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
  FiSettings,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { state, dispatch } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/auth/login");
  };

  const isAdmin = state.user?.groups?.some((group) => group.toLowerCase() === "admin");

  return (
    <header className="bg-white shadow-md  top-0 left-0 right-0 z-50 ">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/logoSafego.png" alt="SafeGo Logo" width={190} height={40} />
        </div>
        <div className="hidden md:flex items-center gap-6 text-neutral font-medium ml-auto">
          <button
            onClick={() => router.push("/search-results")}
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <FiSearch size={20} /> Recherche
          </button>

          <button
            onClick={() => router.push("/trips")}
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <FiPlusCircle size={20} /> Publier un trajet
          </button>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 bg-[linear-gradient(90deg,_#5de0e6,_#004aad)] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              <FiUser size={18} />
              {isUserMenuOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>

            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-48 z-50"
              >
                {state.isAuthenticated ? (
                  <>
                    <p className="text-text font-medium px-3">{state.user?.email}</p>
                    <hr className="my-2" />
                    <button
                      onClick={() => router.push("/profile")}
                      className="block w-full text-left py-2 px-3 hover:bg-background flex items-center gap-2"
                    >
                      <FiUser size={18} /> Profil
                    </button>
                    <button
                      onClick={() => router.push("/my-trips")}
                      className="block w-full text-left py-2 px-3 hover:bg-background flex items-center gap-2"
                    >
                      <FiMenu size={18} /> Mes trajets
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => router.push("/admin")}
                        className="block w-full text-left py-2 px-3 hover:bg-background flex items-center gap-2"
                      >
                        <FiSettings size={18} /> Panneau Admin
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 px-3 hover:bg-red-100 text-error flex items-center gap-2"
                    >
                      <FiLogOut size={18} /> Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="block w-full text-left py-2 px-3 hover:bg-background flex items-center gap-2"
                    >
                      <FiLogIn size={18} /> Connexion
                    </button>
                    <button
                      onClick={() => router.push("/auth/register")}
                      className="block w-full text-left py-2 px-3 hover:bg-background flex items-center gap-2"
                    >
                      <FiUser size={18} /> Inscription
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
        <button className="md:hidden text-neutral" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50"
        >
          <div className="flex flex-col items-center gap-4 p-4 text-text">
            <button
              onClick={() => {
                router.push("/search-results");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 hover:text-primary transition"
            >
              <FiSearch size={20} /> Recherche
            </button>

            <button
              onClick={() => {
                router.push("/trips");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 hover:text-primary transition"
            >
              <FiPlusCircle size={20} /> Publier un trajet
            </button>

            {state.isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    router.push("/profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-primary transition"
                >
                  <FiUser size={20} /> Profil
                </button>
                <button
                  onClick={() => router.push("/my-trips")}
                  className="flex items-center gap-2 hover:text-primary transition"
                >
                  <FiMenu size={18} /> Mes trajets
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      router.push("/admin");
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 hover:text-primary transition"
                  >
                    <FiSettings size={20} /> Admin Panel
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-error hover:text-red-800 transition"
                >
                  <FiLogOut size={20} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="block w-full text-left py-2 px-3 hover:bg-lightHover flex items-center gap-2"
                >
                  <FiLogIn size={18} /> Connexion
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="block w-full text-left py-2 px-3 hover:bg-lightHover flex items-center gap-2"
                >
                  <FiUser size={18} /> Inscription
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
