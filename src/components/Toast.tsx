import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "info" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    info: "bg-blue-600",
    error: "bg-red-600",
  };

  const icons = {
    success: "✓",
    info: "ℹ",
    error: "✕",
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-500 shadow-xl toast-in ${colors[type]}`}>
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-700">{icons[type]}</span>
      {message}
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white text-base">×</button>
    </div>
  );
}
