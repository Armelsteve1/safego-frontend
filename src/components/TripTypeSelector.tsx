"use client";

import { FaBus, FaCar } from "react-icons/fa";
import { TripTypeSelectorProps } from "@/types/trip";

export default function TripTypeSelector({ selected, onChange, counts }: TripTypeSelectorProps) {
  const baseBtn =
    "relative flex items-center gap-2 text-gray-700 pb-1 shrink whitespace-nowrap transition-all duration-300";

  const selectedStyle =
    "font-bold text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[linear-gradient(90deg,#5de0e6,#004aad)]";

  return (
    <div className="bg-white shadow-md py-4 px-6 sm:px-10 rounded-lg flex flex-col lg:flex-row justify-between items-start lg:items-center">
      <div className="text-lg font-semibold mb-4 lg:mb-0 hidden lg:block">Type de voyage</div>
      <div className="flex flex-nowrap items-center justify-between gap-3 w-full ml-[-10px]">
        <button
          className={`${baseBtn} ${!selected ? selectedStyle : ""}`}
          onClick={() => onChange(null)}
        >
          Tout • {counts.total}
        </button>
        <button
          className={`${baseBtn} ${selected === "agence" ? selectedStyle : ""}`}
          onClick={() => onChange("agence")}
        >
          <FaBus size={16} /> Agence • {counts.agence}
        </button>
        <button
          className={`${baseBtn} ${selected === "covoiturage" ? selectedStyle : ""}`}
          onClick={() => onChange("covoiturage")}
        >
          <FaCar size={16} /> Covoiturage • {counts.covoiturage}
        </button>
      </div>
    </div>
  );
}
