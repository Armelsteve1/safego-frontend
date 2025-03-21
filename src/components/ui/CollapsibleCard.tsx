"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleCard = ({ title, children }: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-6 transition-all duration-300">
      <button
        className="flex justify-between items-center w-full text-lg md:text-xl font-semibold text-gray-800 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp size={24} className="text-gray-700 transition-transform duration-300" />
        ) : (
          <ChevronDown size={24} className="text-gray-700 transition-transform duration-300" />
        )}
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleCard;
