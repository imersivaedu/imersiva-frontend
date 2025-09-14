"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="bg-primary-dark shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-1">
            <Image src="/imersiva.png" alt="Imersiva" width={40} height={40} />
            <h1 className="text-xl font-bold text-gray-900 ml-2">Imersiva</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-2" />
              <span className="text-gray-900 font-medium">{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
