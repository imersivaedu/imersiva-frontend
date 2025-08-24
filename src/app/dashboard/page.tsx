"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaGraduationCap,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ClassGrid } from "@/components/ClassGrid";
import { schoolService, SchoolWithClasses } from "@/lib/api";
import Image from "next/image";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [schoolData, setSchoolData] = useState<SchoolWithClasses | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user) return;

      try {
        setLoadingSchool(true);
        // Using the mocked school ID as requested
        const data = await schoolService.getSchoolWithClasses(
          "d96d5d38-6c73-4420-ba86-c994eac336fb"
        );
        setSchoolData(data);
      } catch (error) {
        console.error("Failed to fetch school data:", error);
      } finally {
        setLoadingSchool(false);
      }
    };

    fetchSchoolData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleClassClick = (classId: string) => {
    // TODO: Navigate to class details page
    console.log("Class clicked:", classId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-dark shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1">
              <Image
                src="/imersiva.png"
                alt="Imersiva"
                width={40}
                height={40}
              />
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user.name}!
              </h2>
              <p className="text-gray-600">
                Aqui está um resumo das suas atividades educacionais.
              </p>
            </div>
            <button
              className="btn-primary h-fit disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => alert("troxa")}
            >
              <div className="flex items-center">
                Criar Experiência
                <FaArrowRight className="ml-2" />
              </div>
            </button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Cursos Ativos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Estudantes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Experiências
                  </p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Classes Section */}
          <div className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {schoolData ? `Turmas - ${schoolData.name}` : "Suas Turmas"}
              </h3>
              <p className="text-gray-600">
                Gerencie suas turmas e acompanhe o progresso dos estudantes.
              </p>
            </div>

            {loadingSchool ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <ClassGrid
                classes={schoolData?.Class || []}
                onClassClick={handleClassClick}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
