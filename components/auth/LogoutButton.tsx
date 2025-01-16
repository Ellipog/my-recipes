"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  console.log(isAuthenticated);
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}
