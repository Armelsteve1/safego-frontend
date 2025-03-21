"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CheckCircle, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#004aad] text-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <div
        className={cn(
          "absolute lg:fixed top-0 left-0 h-screen w-64 bg-[#004aad] text-white flex flex-col shadow-lg transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        <div className="p-6 text-2xl font-bold text-center border-b border-white/20">
          Admin Panel
        </div>

        <nav className="flex flex-col gap-4 mt-6 overflow-y-auto">
          <button
            className={cn(
              "flex items-center gap-4 px-6 py-3 text-lg hover:bg-[#003580] transition",
              activeTab === "dashboard" && "bg-[#003580]"
            )}
            onClick={() => {
              setActiveTab("dashboard");
              router.push("/admin/dashboard");
              setIsOpen(false);
            }}
          >
            <LayoutDashboard size={24} />
            Dashboard
          </button>

          <button
            className={cn(
              "flex items-center gap-4 px-6 py-3 text-lg hover:bg-[#003580] transition",
              activeTab === "validation" && "bg-[#003580]"
            )}
            onClick={() => {
              setActiveTab("validation");
              router.push("/admin/validation");
              setIsOpen(false);
            }}
          >
            <CheckCircle size={24} />
            Validation
          </button>

          {/* ✅ Retour à l'accueil */}
          <button
            className="flex items-center gap-4 px-6 py-3 text-lg hover:bg-[#003580] transition"
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
          >
            <Home size={24} />
            Accueil
          </button>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
