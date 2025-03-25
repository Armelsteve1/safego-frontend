"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function NotificationPopup({ message, type, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
            type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
