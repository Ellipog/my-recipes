import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-50 mx-auto"
      >
        <div
          className={`p-4 rounded-lg shadow-lg border ${
            type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-4 hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
